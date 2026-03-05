"use server";

import { z } from "zod";
import { generateObject, resolveProvider } from "@microsaas/llm";
import { checkRateLimit, recordUsage, getCachedResponse, setCachedResponse } from "@microsaas/llm";
import { prisma, resolveWorkspace, resolveMicroappId, resolveByokKeys } from "@microsaas/db";
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

    // Resolve real DB records
    const ctx = await resolveWorkspace(session?.userId || null);
    const microappId = await resolveMicroappId("resume");

    // Resolve LLM provider
    const byok = ctx.mode === "authenticated" ? await resolveByokKeys(ctx.workspaceId) : null;
    const resolved = resolveProvider(
        byok?.provider as any,
        byok?.apiKey
    );

    // Rate limit for shared/demo keys only
    if (resolved.badge !== "BYOK") {
        const rl = await checkRateLimit(clientIp);
        if (!rl.allowed) return { error: rl.message, rateLimited: true };
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
        return { result: JSON.parse(cached), provider: resolved.badge, latencyMs: Date.now() - t0, cached: true };
    }

    let result: ResumeResult | null = null;
    let errorMsg = null;

    try {
        result = await generateObject({
            provider: resolved.provider, apiKey: resolved.apiKey, model: resolved.model,
            prompt, schema: outputSchema,
        }) as ResumeResult;
    } catch (e: any) {
        errorMsg = e.message || "Unknown LLM error";
    }

    const latencyMs = Date.now() - t0;

    if (resolved.badge !== "BYOK" && !errorMsg) await recordUsage(clientIp);
    if (result && resolved.provider !== "dummy") {
        await setCachedResponse(resolved.provider, resolved.model || "", "", prompt, schemaFP, JSON.stringify(result));
    }

    // Persist with REAL IDs
    await prisma.event.create({
        data: {
            workspaceId: ctx.workspaceId, microappId, userId: ctx.userId, action: "generate_bullets",
            metadata: JSON.stringify({ latencyMs, provider: resolved.badge })
        }
    });
    await prisma.microappRun.create({
        data: {
            workspaceId: ctx.workspaceId, userId: ctx.userId, microappId,
            inputJson: JSON.stringify({ role, company, responsibilities, seniority }),
            outputJson: result ? JSON.stringify(result) : null,
            provider: resolved.provider, latencyMs, status: errorMsg ? "error" : "success", errorMessage: errorMsg
        }
    });

    revalidatePath("/");
    if (errorMsg) return { error: errorMsg };
    return { result, provider: resolved.badge, latencyMs };
}
