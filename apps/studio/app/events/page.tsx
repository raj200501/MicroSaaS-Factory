export const dynamic = "force-dynamic";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@microsaas/ui";
import { prisma } from "@microsaas/db";
import { getSession } from "@microsaas/auth";
import { redirect } from "next/navigation";

export default async function EventsPage() {
    const session = await getSession();
    if (!session) redirect("http://localhost:3000/login");

    const membership = await prisma.membership.findFirst({
        where: { userId: session.userId },
    });

    if (!membership) return <div>No workspace found</div>;

    const events = await prisma.event.findMany({
        where: { workspaceId: membership.workspaceId },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Events / Analytics</h2>
                <p className="text-muted-foreground">
                    Recent actions taken by users in your workspace.
                </p>
            </div>
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {events.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">No events yet.</div>
                        ) : (
                            events.map((evt) => (
                                <div key={evt.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                    <div>
                                        <div className="font-medium">{evt.action}</div>
                                        <div className="text-xs text-muted-foreground">App: {evt.microappId || "Global"} | User: {evt.userId || "Anonymous"}</div>
                                    </div>
                                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                                        {evt.createdAt.toLocaleString()}
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
