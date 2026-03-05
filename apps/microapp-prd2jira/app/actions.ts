"use server";

import { z } from "zod";
import { generateObject, resolveProvider } from "@microsaas/llm";
import { checkRateLimit, recordUsage, getCachedResponse, setCachedResponse } from "@microsaas/llm";
import { prisma, resolveWorkspace, resolveMicroappId, resolveByokKeys } from "@microsaas/db";
import { getSession } from "@microsaas/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const ticketSchema = z.object({
    title: z.string().describe("Short, descriptive ticket title"),
    description: z.string().describe("Context and goals for the ticket"),
    acceptanceCriteria: z.array(z.string()).describe("List of conditions for completion"),
    storyPoints: z.number().describe("Fibonacci scale estimation (1, 2, 3, 5, 8, 13)"),
});

const epicSchema = z.object({
    title: z.string().describe("Epic title representing a major feature"),
    summary: z.string().describe("Brief epic summary"),
    tickets: z.array(ticketSchema),
});

export const outputSchema = z.object({
    epics: z.array(epicSchema).describe("List of Epics and their associated tickets extracted from the PRD"),
});

export type PRDResult = z.infer<typeof outputSchema>;

export async function generateTickets(prevState: any, formData: FormData) {
    const t0 = Date.now();
    const session = await getSession();
    const headersList = headers();
    const clientIp = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    const ctx = await resolveWorkspace(session?.userId || null);
    const microappId = await resolveMicroappId("prd2jira");
    const byok = ctx.mode === "authenticated" ? await resolveByokKeys(ctx.workspaceId) : null;
    const resolved = resolveProvider(byok?.provider as any, byok?.apiKey);

    if (resolved.badge !== "BYOK") {
        const rl = await checkRateLimit(clientIp);
        if (!rl.allowed) return { error: rl.message, rateLimited: true };
    }

    const prd = formData.get("prd") as string;
    const timeline = formData.get("timeline") as string;
    const teamSize = formData.get("teamSize") as string;

    const prompt = `PRD Payload: ${prd}\nTimeline Constraint: ${timeline || "None specified"}\nTeam Capacity: ${teamSize || "Unknown"}\n\nGenerate structured Agile Epics and Tickets from the PRD. Ensure tickets are appropriately sized.`;

    const schemaFP = "prd2jira-v1";
    const cached = await getCachedResponse(resolved.provider, resolved.model || "", "", prompt, schemaFP);
    if (cached) {
        return { result: JSON.parse(cached), provider: resolved.badge, latencyMs: Date.now() - t0, cached: true };
    }

    let result: PRDResult | null = null;
    let errorMsg = null;

    try {
        result = await generateObject({
            provider: resolved.provider, apiKey: resolved.apiKey, model: resolved.model,
            prompt, schema: outputSchema,
        }) as PRDResult;
    } catch (e: any) {
        errorMsg = e.message || "Unknown LLM error";
    }

    const latencyMs = Date.now() - t0;

    if (resolved.badge !== "BYOK" && !errorMsg) await recordUsage(clientIp);
    if (result && resolved.provider !== "dummy") {
        await setCachedResponse(resolved.provider, resolved.model || "", "", prompt, schemaFP, JSON.stringify(result));
    }

    await prisma.event.create({
        data: {
            workspaceId: ctx.workspaceId, microappId, userId: ctx.userId, action: "generate_tickets",
            metadata: JSON.stringify({ latencyMs, provider: resolved.badge })
        }
    });
    await prisma.microappRun.create({
        data: {
            workspaceId: ctx.workspaceId, userId: ctx.userId, microappId,
            inputJson: JSON.stringify({ timeline, teamSize, prdPreview: prd.slice(0, 100) }),
            outputJson: result ? JSON.stringify(result) : null,
            provider: resolved.provider, latencyMs, status: errorMsg ? "error" : "success", errorMessage: errorMsg
        }
    });

    revalidatePath("/");
    if (errorMsg) return { error: errorMsg };
    return { result, provider: resolved.badge, latencyMs };
}
