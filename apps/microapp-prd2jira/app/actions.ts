"use server";

import { z } from "zod";
import { generateObject } from "@microsaas/llm";
import { prisma } from "@microsaas/db";
import { getSession } from "@microsaas/auth";
import { revalidatePath } from "next/cache";

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

const mockResult: PRDResult = {
    epics: [
        {
            title: "User Authentication V2",
            summary: "Migrate from legacy auth to Magic Links",
            tickets: [
                {
                    title: "Setup DB schema for magic links",
                    description: "Add a token column to the user table to support magic link verification.",
                    acceptanceCriteria: ["Schema updated", "Migrations run successfully", "Tests pass"],
                    storyPoints: 3
                },
                {
                    title: "Implement /api/auth/send email route",
                    description: "Create the API endpoint that generates the token and dispatches the email.",
                    acceptanceCriteria: ["Endpoint exists", "Validates email format", "Sends email with valid token"],
                    storyPoints: 5
                }
            ]
        }
    ]
}

export async function generateTickets(prevState: any, formData: FormData) {
    const t0 = Date.now();
    const session = await getSession();

    let workspaceId = "demo-workspace";
    let userId = null;
    let useProvider = "dummy";
    let apiKey = undefined;

    if (session) {
        userId = session.userId;
        const membership = await prisma.membership.findFirst({
            where: { userId: session.userId }
        });
        if (membership) {
            workspaceId = membership.workspaceId;
            const keys = await prisma.llmKey.findMany({ where: { workspaceId } });
            if (keys.length > 0) {
                const found = keys.find(k => k.provider === "anthropic") || keys[0];
                useProvider = found.provider;
                apiKey = Buffer.from(found.encryptedKey, "base64").toString("ascii");
            }
        }
    }

    const prd = formData.get("prd") as string;
    const timeline = formData.get("timeline") as string;
    const teamSize = formData.get("teamSize") as string;

    const prompt = `
    PRD Payload: ${prd}
    Timeline Constraint: ${timeline || "None specified"}
    Team Capacity: ${teamSize || "Unknown"}
    
    Instruction: Generate structured Agile Epics and Tickets from the PRD provided.
    Ensure tickets are appropriately sized based on team capacity.
  `;

    let result: PRDResult | null = null;
    let errorMsg = null;

    try {
        const aiResult = await generateObject({
            provider: useProvider as any,
            apiKey,
            prompt,
            schema: outputSchema,
            mockResponse: mockResult
        });

        result = aiResult as PRDResult;
    } catch (e: any) {
        errorMsg = e.message || "Unknown LLM error";
    }

    const latencyMs = Date.now() - t0;

    // Track event
    await prisma.event.create({
        data: {
            workspaceId,
            microappId: "prd2jira",
            userId,
            action: "generate_tickets",
            metadata: JSON.stringify({ latencyMs, provider: useProvider })
        }
    });

    // Save run history
    await prisma.microappRun.create({
        data: {
            workspaceId,
            userId,
            microappId: "prd2jira",
            inputJson: JSON.stringify({ timeline, teamSize, prdPreview: prd.slice(0, 100) }),
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

    return { result, provider: useProvider, latencyMs };
}
