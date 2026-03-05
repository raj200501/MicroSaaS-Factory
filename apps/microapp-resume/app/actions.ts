"use server";

import { z } from "zod";
import { generateObject, resolveProvider, getLlmConfig } from "@microsaas/llm";
import { checkRateLimit, recordUsage, getCachedResponse, setCachedResponse } from "@microsaas/llm";
import { prisma } from "@microsaas/db";
import { getSession } from "@microsaas/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const outputSchema = z.object({
    impactBullets: z.array(z.string()).describe("4 ATS-friendly bullets focused on measurable impact"),
    conciseBullets: z.array(z.string()).describe("4 concise bullets for executive summaries"),
    technicalBullets: z.array(z.string()).describe("4 bullets highlighting technical depth and stack"),
    whyItWorks: z.string().describe("A short note explaining why these bullets are effective"),
});

export type ResumeResult = z.infer<typeof outputSchema>;

export async function generateResumeBullets(prevState: any, formData: FormData) {
    const t0 = Date.now();
    const session = await getSession();
    const headersList = headers();
    const clientIp = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    // Resolve provider
    let workspaceId = "demo-workspace";
    let userId = null;
    let byokProvider = undefined;
    let byokKey = undefined;

    if (session) {
        userId = session.userId;
        const membership = await prisma.membership.findFirst({ where: { userId: session.userId } });
        if (membership) {
            workspaceId = membership.workspaceId;
            const keys = await prisma.llmKey.findMany({ where: { workspaceId } });
            if (keys.length > 0) {
                const found = keys.find(k => k.provider === "openai") || keys.find(k => k.provider === "gemini") || keys[0];
                byokProvider = found.provider as any;
                byokKey = Buffer.from(found.encryptedKey, "base64").toString("ascii");
            }
        }
    }

    const resolved = resolveProvider(byokProvider, byokKey);

    // Rate limit for demo/shared keys only
    if (resolved.badge !== "BYOK") {
        const rl = await checkRateLimit(clientIp);
        if (!rl.allowed) {
            return { error: rl.message, rateLimited: true };
        }
    }

    const role = formData.get("role") as string;
    const company = formData.get("company") as string;
    const responsibilities = formData.get("responsibilities") as string;
    const seniority = formData.get("seniority") as string;

    const prompt = `Role: ${role}\nCompany: ${company}\nSeniority: ${seniority}\nResponsibilities: ${responsibilities}\n\nTurn these raw notes into highly polished resume bullets.`;

    // Check cache
    const schemaFP = "resume-v1";
    const cached = await getCachedResponse(resolved.provider, resolved.model || "", "", prompt, schemaFP);
    if (cached) {
        const latencyMs = Date.now() - t0;
        return { result: JSON.parse(cached), provider: resolved.badge, latencyMs, cached: true };
    }

    let result: ResumeResult | null = null;
    let errorMsg = null;

    try {
        result = await generateObject({
            provider: resolved.provider,
            apiKey: resolved.apiKey,
            model: resolved.model,
            prompt,
            schema: outputSchema,
        }) as ResumeResult;
    } catch (e: any) {
        errorMsg = e.message || "Unknown LLM error";
    }

    const latencyMs = Date.now() - t0;

    // Record usage for rate limiting
    if (resolved.badge !== "BYOK" && !errorMsg) {
        await recordUsage(clientIp);
    }

    // Cache successful result
    if (result && resolved.provider !== "dummy") {
        await setCachedResponse(resolved.provider, resolved.model || "", "", prompt, schemaFP, JSON.stringify(result));
    }

    // Track event + run
    await prisma.event.create({
        data: {
            workspaceId, microappId: "resume", userId, action: "generate_bullets",
            metadata: JSON.stringify({ latencyMs, provider: resolved.badge })
        }
    });
    await prisma.microappRun.create({
        data: {
            workspaceId, userId, microappId: "resume",
            inputJson: JSON.stringify({ role, company, responsibilities, seniority }),
            outputJson: result ? JSON.stringify(result) : null,
            provider: resolved.provider, latencyMs, status: errorMsg ? "error" : "success", errorMessage: errorMsg
        }
    });

    revalidatePath("/");
    if (errorMsg) return { error: errorMsg };
    return { result, provider: resolved.badge, latencyMs };
}
