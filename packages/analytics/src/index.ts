import { prisma } from "@microsaas/db";

export interface TrackEventInput {
    workspaceId: string;
    microappId?: string;
    userId?: string;
    action: string;
    metadata?: Record<string, any>;
}

export async function trackEvent(input: TrackEventInput) {
    try {
        await prisma.event.create({
            data: {
                workspaceId: input.workspaceId,
                microappId: input.microappId,
                userId: input.userId,
                action: input.action,
                metadata: input.metadata ? JSON.stringify(input.metadata) : null,
            },
        });
        console.log(`[Analytics] Tracked event: ${input.action}`);
    } catch (error) {
        console.error("[Analytics] Failed to track event:", error);
    }
}
