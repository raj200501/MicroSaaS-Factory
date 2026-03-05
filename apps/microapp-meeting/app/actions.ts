"use server";

import { z } from "zod";
import { generateObject, resolveProvider } from "@microsaas/llm";
import { checkRateLimit, recordUsage, getCachedResponse, setCachedResponse } from "@microsaas/llm";
import { prisma, resolveWorkspace, resolveMicroappId, resolveByokKeys } from "@microsaas/db";
import { getSession } from "@microsaas/auth";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@microsaas/email";
import { headers } from "next/headers";

const actionItemSchema = z.object({
    assignee: z.string().describe("Person responsible"),
    task: z.string().describe("The action to be taken"),
    deadline: z.string().describe("Due date or timeframe if mentioned, otherwise ASAP"),
});

export const outputSchema = z.object({
    actionItems: z.array(actionItemSchema).describe("List of action items extracted from the meeting"),
    emailDraft: z.string().describe("A professional follow-up email summarizing the meeting and listing actions"),
});

export type MeetingResult = z.infer<typeof outputSchema>;

export async function extractMeetingActions(prevState: any, formData: FormData) {
    const t0 = Date.now();
    const session = await getSession();
    const headersList = headers();
    const clientIp = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    const ctx = await resolveWorkspace(session?.userId || null);
    const microappId = await resolveMicroappId("meeting");
    let userEmail = "demo@example.com";

    if (ctx.userId) {
        const user = await prisma.user.findUnique({ where: { id: ctx.userId } });
        if (user) userEmail = user.email;
    }

    const byok = ctx.mode === "authenticated" ? await resolveByokKeys(ctx.workspaceId) : null;
    const resolved = resolveProvider(byok?.provider as any, byok?.apiKey);

    if (resolved.badge !== "BYOK") {
        const rl = await checkRateLimit(clientIp);
        if (!rl.allowed) return { error: rl.message, rateLimited: true };
    }

    const notes = formData.get("notes") as string;
    const prompt = `Raw Meeting Notes:\n${notes}\n\nExtract specific action items (assignee, task, deadline) and draft a professional follow-up email.`;

    const schemaFP = "meeting-v1";
    const cached = await getCachedResponse(resolved.provider, resolved.model || "", "", prompt, schemaFP);
    if (cached) {
        return { result: JSON.parse(cached), provider: resolved.badge, latencyMs: Date.now() - t0, cached: true, userEmail };
    }

    let result: MeetingResult | null = null;
    let errorMsg = null;

    try {
        result = await generateObject({
            provider: resolved.provider, apiKey: resolved.apiKey, model: resolved.model,
            prompt, schema: outputSchema,
        }) as MeetingResult;
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
            workspaceId: ctx.workspaceId, microappId, userId: ctx.userId, action: "extract_notes",
            metadata: JSON.stringify({ latencyMs, provider: resolved.badge })
        }
    });
    await prisma.microappRun.create({
        data: {
            workspaceId: ctx.workspaceId, userId: ctx.userId, microappId,
            inputJson: JSON.stringify({ notesPreview: notes.slice(0, 100) }),
            outputJson: result ? JSON.stringify(result) : null,
            provider: resolved.provider, latencyMs, status: errorMsg ? "error" : "success", errorMessage: errorMsg
        }
    });

    revalidatePath("/");
    if (errorMsg) return { error: errorMsg };
    return { result, provider: resolved.badge, latencyMs, userEmail };
}

export async function handleSendFollowUp(toEmail: string, fromEmail: string, draftBody: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    await sendEmail({ to: toEmail, from: fromEmail, subject: "Meeting Follow-up & Action Items", bodyText: draftBody });
}
