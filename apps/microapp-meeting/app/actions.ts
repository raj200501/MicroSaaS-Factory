"use server";

import { z } from "zod";
import { generateObject, resolveProvider } from "@microsaas/llm";
import { checkRateLimit, recordUsage, getCachedResponse, setCachedResponse } from "@microsaas/llm";
import { prisma } from "@microsaas/db";
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

    let workspaceId = "demo-workspace";
    let userId = null;
    let userEmail = "demo@example.com";
    let byokProvider = undefined;
    let byokKey = undefined;

    if (session) {
        userId = session.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) userEmail = user.email;

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

    if (resolved.badge !== "BYOK") {
        const rl = await checkRateLimit(clientIp);
        if (!rl.allowed) return { error: rl.message, rateLimited: true };
    }

    const notes = formData.get("notes") as string;
    const prompt = `Raw Meeting Notes:\n${notes}\n\nExtract specific action items (assignee, task, deadline) and draft a professional follow-up email.`;

    const schemaFP = "meeting-v1";
    const cached = await getCachedResponse(resolved.provider, resolved.model || "", "", prompt, schemaFP);
    if (cached) {
        const latencyMs = Date.now() - t0;
        return { result: JSON.parse(cached), provider: resolved.badge, latencyMs, cached: true, userEmail };
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
            workspaceId, microappId: "meeting", userId, action: "extract_notes",
            metadata: JSON.stringify({ latencyMs, provider: resolved.badge })
        }
    });
    await prisma.microappRun.create({
        data: {
            workspaceId, userId, microappId: "meeting",
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
