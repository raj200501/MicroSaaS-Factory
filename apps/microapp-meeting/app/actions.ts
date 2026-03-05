"use server";

import { z } from "zod";
import { generateObject } from "@microsaas/llm";
import { prisma } from "@microsaas/db";
import { getSession } from "@microsaas/auth";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@microsaas/email";

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

const mockResult: MeetingResult = {
    actionItems: [
        { assignee: "Alice", task: "Review the Q3 marketing budget", deadline: "Friday" },
        { assignee: "Bob", task: "Setup the new AWS staging environment", deadline: "EOD Wednesday" },
    ],
    emailDraft: "Hi Team,\n\nThanks for a great meeting today. Here is a quick summary of our action items:\n\n- Alice: Review the Q3 marketing budget (Due: Friday)\n- Bob: Setup the new AWS staging environment (Due: EOD Wednesday)\n\nLet me know if I missed anything.\n\nBest,\n[Your Name]"
};

export async function extractMeetingActions(prevState: any, formData: FormData) {
    const t0 = Date.now();
    const session = await getSession();

    let workspaceId = "demo-workspace";
    let userId = null;
    let useProvider = "dummy";
    let apiKey = undefined;
    let userEmail = "demo@example.com";

    if (session) {
        userId = session.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) userEmail = user.email;

        const membership = await prisma.membership.findFirst({
            where: { userId: session.userId }
        });
        if (membership) {
            workspaceId = membership.workspaceId;
            const keys = await prisma.llmKey.findMany({ where: { workspaceId } });
            if (keys.length > 0) {
                const found = keys.find(k => k.provider === "openai") || keys[0];
                useProvider = found.provider;
                apiKey = Buffer.from(found.encryptedKey, "base64").toString("ascii");
            }
        }
    }

    const notes = formData.get("notes") as string;

    const prompt = `
    Raw Meeting Notes:
    ${notes}

    Instruction: Extract specific action items (assignee, task, deadline) and draft a professional follow-up email.
  `;

    let result: MeetingResult | null = null;
    let errorMsg = null;

    try {
        const aiResult = await generateObject({
            provider: useProvider as any,
            apiKey,
            prompt,
            schema: outputSchema,
            mockResponse: mockResult
        });

        result = aiResult as MeetingResult;
    } catch (e: any) {
        errorMsg = e.message || "Unknown LLM error";
    }

    const latencyMs = Date.now() - t0;

    // Track event
    await prisma.event.create({
        data: {
            workspaceId,
            microappId: "meeting",
            userId,
            action: "extract_notes",
            metadata: JSON.stringify({ latencyMs, provider: useProvider })
        }
    });

    // Save run history
    await prisma.microappRun.create({
        data: {
            workspaceId,
            userId,
            microappId: "meeting",
            inputJson: JSON.stringify({ notesPreview: notes.slice(0, 100) }),
            outputJson: result ? JSON.stringify(result) : null,
            provider: useProvider,
            latencyMs,
            status: errorMsg ? "error" : "success",
            errorMessage: errorMsg
        }
    });

    revalidatePath("/");

    if (errorMsg) {
        return { error: errorMsg };
    }

    return { result, provider: useProvider, latencyMs, userEmail };
}

export async function handleSendFollowUp(toEmail: string, fromEmail: string, draftBody: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    await sendEmail({
        to: toEmail,
        from: fromEmail,
        subject: "Meeting Follow-up & Action Items",
        bodyText: draftBody
    });
}
