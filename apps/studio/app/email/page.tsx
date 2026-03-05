export const dynamic = "force-dynamic";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@microsaas/ui";
import { prisma } from "@microsaas/db";
import { getSession } from "@microsaas/auth";
import { redirect } from "next/navigation";

export default async function EmailsPage() {
    const session = await getSession();
    if (!session) redirect("http://localhost:3000/login");

    // In a real app we'd filter emails by workspace.
    // The stub captures everything globally for local testing.
    const emails = await prisma.emailMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Captured Emails</h2>
                <p className="text-muted-foreground">
                    Outbox of stubbed emails sent via local dev environment.
                </p>
            </div>
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {emails.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">No emails sent yet.</div>
                        ) : (
                            emails.map((msg) => (
                                <div key={msg.id} className="p-4 flex flex-col gap-1">
                                    <div className="flex justify-between items-start">
                                        <div className="font-medium truncate pr-4">{msg.subject}</div>
                                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                                            {msg.createdAt.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        To: {msg.to} | From: {msg.from}
                                    </div>
                                    <div className="bg-muted p-2 rounded text-xs truncate mt-2">
                                        {msg.bodyText}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
