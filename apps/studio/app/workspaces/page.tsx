import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "@microsaas/ui";
import { prisma } from "@microsaas/db";
import { getSession } from "@microsaas/auth";
import { redirect } from "next/navigation";

export default async function WorkspacesPage() {
    const session = await getSession();
    if (!session) redirect("http://localhost:3000/login");

    const memberships = await prisma.membership.findMany({
        where: { userId: session.userId },
        include: { workspace: true },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Workspaces</h2>
                    <p className="text-muted-foreground">
                        Manage the organizations you belong to.
                    </p>
                </div>
                <Button>Create Workspace</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {memberships.map((m) => (
                    <Card key={m.workspace.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {m.workspace.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground mt-4">
                                Role: <span className="capitalize">{m.role}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
