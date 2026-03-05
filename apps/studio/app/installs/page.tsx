export const dynamic = "force-dynamic";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@microsaas/ui";
import { prisma } from "@microsaas/db";
import { getSession } from "@microsaas/auth";
import { redirect } from "next/navigation";

export default async function InstallsPage() {
    const session = await getSession();
    if (!session) redirect("http://localhost:3000/login");

    // Get first workspace (default logic for simplicity)
    const membership = await prisma.membership.findFirst({
        where: { userId: session.userId },
    });

    if (!membership) return <div>No workspace found</div>;

    const installs = await prisma.microappInstall.findMany({
        where: { workspaceId: membership.workspaceId },
        include: { microapp: true },
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Installed Microapps</h2>
                <p className="text-muted-foreground">
                    Manage apps enabled for your workspace.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {installs.map((install) => (
                    <Card key={install.id}>
                        <CardHeader>
                            <CardTitle>{install.microapp.name}</CardTitle>
                            <CardDescription>Status: {install.enabled ? "Enabled" : "Disabled"}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
