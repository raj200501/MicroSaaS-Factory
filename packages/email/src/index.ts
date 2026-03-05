import { prisma } from "@microsaas/db";

export interface SendEmailInput {
    to: string;
    from: string;
    subject: string;
    bodyText: string;
    bodyHtml?: string;
}

export async function sendEmail(input: SendEmailInput) {
    try {
        // In local dev, we just save it to the DB so the Studio app can view it
        await prisma.emailMessage.create({
            data: {
                to: input.to,
                from: input.from,
                subject: input.subject,
                bodyText: input.bodyText,
                bodyHtml: input.bodyHtml,
                status: "sent_locally",
            },
        });
        console.log(`[Email] Captured local email to ${input.to}: "${input.subject}"`);
    } catch (error) {
        console.error("[Email] Failed to capture local email:", error);
    }
}
