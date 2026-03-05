import { Card, CardContent } from "@microsaas/ui";
import { prisma } from "@microsaas/db";
import { getSession } from "@microsaas/auth";
import { redirect } from "next/navigation";

export default async function RunsPage() {
    const session = await getSession();
    if (!session) redirect("http://localhost:3000/login");

    const membership = await prisma.membership.findFirst({
        where: { userId: session.userId },
    });

    if (!membership) return <div>No workspace found</div>;

    const runs = await prisma.microappRun.findMany({
        where: { workspaceId: membership.workspaceId },
        include: { microapp: true },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">LLM Runs History</h2>
                <p className="text-muted-foreground">
                    Audit log of all LLM executions within your workspace.
                </p>
            </div>
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {runs.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">No LLM runs recorded yet.</div>
                        ) : (
                            runs.map((run) => (
                                <div key={run.id} className="p-4 flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{run.microapp.name}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${run.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {run.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1 sm:mt-0">
                                            {run.createdAt.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 text-xs text-muted-foreground">
                                        <span>Provider: <strong className="capitalize">{run.provider}</strong></span>
                                        {run.model && <span>Model: <strong>{run.model}</strong></span>}
                                        {run.latencyMs && <span>Latency: <strong>{run.latencyMs}ms</strong></span>}
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4 mt-2">
                                        <div className="bg-muted p-2 rounded overflow-y-auto max-h-32">
                                            <div className="text-xs font-semibold mb-1">Input:</div>
                                            <pre className="text-[10px] whitespace-pre-wrap">{run.inputJson}</pre>
                                        </div>
                                        {run.status === "success" ? (
                                            <div className="bg-muted p-2 rounded overflow-y-auto max-h-32">
                                                <div className="text-xs font-semibold mb-1">Output:</div>
                                                <pre className="text-[10px] whitespace-pre-wrap">{run.outputJson}</pre>
                                            </div>
                                        ) : (
                                            <div className="bg-red-50 text-red-800 p-2 rounded overflow-y-auto max-h-32">
                                                <div className="text-xs font-semibold mb-1">Error:</div>
                                                <pre className="text-[10px] whitespace-pre-wrap">{run.errorMessage}</pre>
                                            </div>
                                        )}
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
