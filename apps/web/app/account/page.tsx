import { prisma, resolveWorkspace } from "@microsaas/db";
import { getSession } from "@microsaas/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) redirect("/login");

    const { workspaceId } = await resolveWorkspace(session.userId);

    const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
    const installs = await prisma.microappInstall.findMany({
        where: { workspaceId, enabled: true },
        include: { microapp: true },
    });
    const recentRuns = await prisma.microappRun.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { microapp: true },
    });

    const microappPorts: Record<string, number> = {
        resume: 3002,
        prd2jira: 3003,
        meeting: 3004,
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {user.email} · {workspace?.name || "My Workspace"}
                    </p>
                </div>
                <div className="flex gap-2">
                    <a
                        href="http://localhost:3001"
                        className="px-4 py-2 rounded-lg glass glass-hover font-semibold text-sm"
                    >
                        🔧 Studio
                    </a>
                    <form action={async () => {
                        "use server";
                        const { cookies } = await import("next/headers");
                        cookies().delete("session");
                        redirect("/login");
                    }}>
                        <button type="submit" className="px-4 py-2 rounded-lg glass glass-hover font-semibold text-sm">
                            Logout
                        </button>
                    </form>
                </div>
            </div>

            {/* Installed Microapps */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Your Tools</h2>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {installs.map((install) => (
                        <a
                            key={install.id}
                            href={`http://localhost:${microappPorts[install.microapp.slug] || 3002}`}
                            className="glass rounded-xl p-6 glass-hover block group"
                        >
                            <h3 className="font-semibold group-hover:text-white transition-colors">
                                {install.microapp.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                {install.microapp.description}
                            </p>
                            <span className="text-xs text-green-400 mt-2 block">
                                ✅ Installed · Port {microappPorts[install.microapp.slug] || "?"}
                            </span>
                        </a>
                    ))}
                    {installs.length === 0 && (
                        <p className="text-sm text-muted-foreground col-span-full">
                            No tools installed. Run <code>pnpm db:seed</code> to get started.
                        </p>
                    )}
                </div>
            </div>

            {/* Recent Runs */}
            <div>
                <h2 className="text-xl font-bold mb-4">Recent Runs</h2>
                {recentRuns.length > 0 ? (
                    <div className="glass rounded-xl divide-y divide-white/5">
                        {recentRuns.map((run) => (
                            <div key={run.id} className="p-4 flex items-center justify-between">
                                <div>
                                    <span className="font-medium text-sm">{run.microapp.name}</span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                        {run.provider} · {run.latencyMs || 0}ms
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${run.status === "success"
                                            ? "bg-green-500/20 text-green-300"
                                            : "bg-red-500/20 text-red-300"
                                        }`}>
                                        {run.status}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(run.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass rounded-xl p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            No runs yet. Open a tool above and generate something!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
