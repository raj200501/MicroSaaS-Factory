import { prisma } from "@microsaas/db";
import { hashIp, getLlmConfig, computeCacheKey } from "./providers";

// ------- Rate Limiting -------

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    message?: string;
}

function today(): string {
    return new Date().toISOString().slice(0, 10);
}

export async function checkRateLimit(clientIp: string): Promise<RateLimitResult> {
    const config = getLlmConfig();
    if (!config.demoMode) return { allowed: true, remaining: config.dailyPerIpLimit };

    const dayStr = today();
    const ipH = hashIp(clientIp);

    // Per-IP check
    const existing = await prisma.apiUsage.findUnique({
        where: { day_ipHash: { day: dayStr, ipHash: ipH } },
    });

    const currentCount = existing?.count ?? 0;

    if (currentCount >= config.dailyPerIpLimit) {
        return {
            allowed: false,
            remaining: 0,
            message: `Daily demo limit reached (${config.dailyPerIpLimit}/day). Add your own API key in Studio → LLM Keys for unlimited access.`,
        };
    }

    // Global check
    const globalUsage = await prisma.apiUsage.aggregate({
        where: { day: dayStr },
        _sum: { count: true },
    });
    const globalCount = globalUsage._sum.count ?? 0;

    if (globalCount >= config.dailyGlobalLimit) {
        return {
            allowed: false,
            remaining: 0,
            message: `Global demo capacity reached for today. Try again tomorrow or add your own API key in Studio → LLM Keys.`,
        };
    }

    return { allowed: true, remaining: config.dailyPerIpLimit - currentCount };
}

export async function recordUsage(clientIp: string): Promise<void> {
    const dayStr = today();
    const ipH = hashIp(clientIp);

    await prisma.apiUsage.upsert({
        where: { day_ipHash: { day: dayStr, ipHash: ipH } },
        update: { count: { increment: 1 }, lastAt: new Date() },
        create: { day: dayStr, ipHash: ipH, count: 1 },
    });
}

// ------- Cache -------

export async function getCachedResponse(
    provider: string, model: string, system: string, prompt: string, schemaFingerprint = ""
): Promise<string | null> {
    const key = computeCacheKey(provider, model, system, prompt, schemaFingerprint);
    const cached = await prisma.llmCache.findUnique({ where: { cacheKey: key } });
    if (!cached) return null;
    if (cached.expiresAt < new Date()) {
        // Expired — clean up
        await prisma.llmCache.delete({ where: { cacheKey: key } }).catch(() => { });
        return null;
    }
    return cached.outputJson;
}

export async function setCachedResponse(
    provider: string, model: string, system: string, prompt: string,
    schemaFingerprint: string, outputJson: string
): Promise<void> {
    const config = getLlmConfig();
    const key = computeCacheKey(provider, model, system, prompt, schemaFingerprint);
    const expiresAt = new Date(Date.now() + config.cacheTtlHours * 60 * 60 * 1000);
    const inputHash = computeCacheKey("", "", system, prompt);

    await prisma.llmCache.upsert({
        where: { cacheKey: key },
        update: { outputJson, expiresAt },
        create: { cacheKey: key, provider, model, inputHash, outputJson, expiresAt },
    });
}

// ------- Human Check (lightweight math challenge) -------

const challenges = [
    { q: "What is 3 + 4?", a: "7" },
    { q: "What is 8 - 2?", a: "6" },
    { q: "What is 5 × 2?", a: "10" },
    { q: "What is 9 + 1?", a: "10" },
    { q: "What is 12 - 5?", a: "7" },
    { q: "What is 6 + 3?", a: "9" },
    { q: "What is 4 × 3?", a: "12" },
    { q: "What is 15 - 7?", a: "8" },
];

export function getChallenge(): { question: string; token: string } {
    const idx = Math.floor(Math.random() * challenges.length);
    const c = challenges[idx]!;
    // Token = base64 of index so server can verify
    const token = Buffer.from(`${idx}:${c.a}`).toString("base64");
    return { question: c.q, token };
}

export function verifyChallenge(token: string, answer: string): boolean {
    try {
        const decoded = Buffer.from(token, "base64").toString("ascii");
        const [, expected] = decoded.split(":");
        return expected === answer.trim();
    } catch {
        return false;
    }
}
