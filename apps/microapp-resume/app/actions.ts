"use server";

import { z } from "zod";
import { generateObject } from "@microsaas/llm";
import { prisma } from "@microsaas/db";
import { getSession } from "@microsaas/auth";
import { revalidatePath } from "next/cache";

export const outputSchema = z.object({
    impactBullets: z.array(z.string()).describe("4 ATS-friendly bullets focused on measurable impact"),
    conciseBullets: z.array(z.string()).describe("4 concise bullets for executive summaries"),
    technicalBullets: z.array(z.string()).describe("4 bullets highlighting technical depth and stack"),
    whyItWorks: z.string().describe("A short note explaining why these bullets are effective"),
});

export type ResumeResult = z.infer<typeof outputSchema>;

// Default mock for local dev without keys
const mockResumeContent: ResumeResult = {
    impactBullets: [
        "Spearheaded the development of a real-time dashboard, decreasing data retrieval time by 40% and saving 20 hours per week for analysts.",
        "Led a cross-functional team of 5 engineers to deliver the core microservices architecture 2 weeks ahead of schedule.",
        "Architected robust API endpoints handling 1M+ daily requests with 99.99% uptime.",
        "Optimized legacy monolithic codebase by migrating 30% of features to serverless functions, cutting AWS costs by $5k/mo."
    ],
    conciseBullets: [
        "Built real-time dashboard (40% faster).",
        "Managed 5-person engineering team.",
        "Scaled API to 1M+ daily requests.",
        "Migrated to serverless, saving $5k/mo."
    ],
    technicalBullets: [
        "Implemented Next.js, React, and TypeScript for the frontend.",
        "Designed PostgreSQL schemas and optimized Prisma queries.",
        "Deployed via Docker and GitHub Actions to AWS ECS.",
        "Integrated Redis caching layer to reduce DB load."
    ],
    whyItWorks: "These bullets start with strong action verbs and highlight specific, measurable outcomes (e.g., 40%, $5k/mo) while proving technical depth."
};

export async function generateResumeBullets(prevState: any, formData: FormData) {
    const t0 = Date.now();
    const session = await getSession();

    // In demo mode without session, we use a fallback anonymous user ID, or reject.
    // The spec allows Demo mode. For simplicity if session is null, we assume demo.
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
            // Try to get a real key
            const keys = await prisma.llmKey.findMany({ where: { workspaceId } });
            if (keys.length > 0) {
                // prefer openai for this app
                const found = keys.find(k => k.provider === "openai") || keys[0];
                useProvider = found.provider;

                // Simulating decryption of obfuscated key
                apiKey = Buffer.from(found.encryptedKey, "base64").toString("ascii");
            }
        }
    }

    const role = formData.get("role") as string;
    const company = formData.get("company") as string;
    const responsibilities = formData.get("responsibilities") as string;
    const seniority = formData.get("seniority") as string;

    const prompt = `
    Role: ${role}
    Company: ${company}
    Seniority: ${seniority}
    Responsibilities: ${responsibilities}

    Turn these raw notes into highly polished resume bullets.
  `;

    let result: ResumeResult | null = null;
    let errorMsg = null;

    try {
        const aiResult = await generateObject({
            provider: useProvider as any,
            apiKey,
            prompt,
            schema: outputSchema,
            mockResponse: mockResumeContent
        });

        result = aiResult as ResumeResult;
    } catch (e: any) {
        errorMsg = e.message || "Unknown LLM error";
    }

    const latencyMs = Date.now() - t0;

    // Track event
    await prisma.event.create({
        data: {
            workspaceId,
            microappId: "resume",
            userId,
            action: "generate_bullets",
            metadata: JSON.stringify({ latencyMs, provider: useProvider })
        }
    });

    // Save run history
    await prisma.microappRun.create({
        data: {
            workspaceId,
            userId,
            microappId: "resume",
            inputJson: JSON.stringify({ role, company, responsibilities, seniority }),
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
