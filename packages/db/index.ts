import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "@prisma/client";

// ===== Shared DB helpers =====

/**
 * Resolve workspace context from a user session.
 * If user has no workspace, creates one automatically.
 * If no session (demo mode), returns the seeded demo workspace.
 */
export async function resolveWorkspace(userId: string | null): Promise<{
    workspaceId: string;
    userId: string | null;
    mode: "authenticated" | "demo";
}> {
    if (userId) {
        // Find existing membership
        const membership = await prisma.membership.findFirst({
            where: { userId },
            include: { workspace: true },
        });
        if (membership) {
            return { workspaceId: membership.workspaceId, userId, mode: "authenticated" };
        }
        // Auto-create workspace for user with no membership
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const slug = `ws-${userId.slice(0, 8)}`;
        const workspace = await prisma.workspace.create({
            data: {
                name: user?.email ? `${user.email.split("@")[0]}'s Workspace` : "My Workspace",
                slug,
                memberships: { create: { userId, role: "admin" } },
            },
        });
        // Install default microapps
        const microapps = await prisma.microapp.findMany();
        for (const app of microapps) {
            await prisma.microappInstall.create({
                data: { workspaceId: workspace.id, microappId: app.id, enabled: true },
            }).catch(() => { }); // ignore duplicate
        }
        return { workspaceId: workspace.id, userId, mode: "authenticated" };
    }
    // Demo mode: use seeded demo workspace
    const demoWs = await prisma.workspace.findFirst({ where: { slug: "default-workspace" } });
    if (demoWs) {
        return { workspaceId: demoWs.id, userId: null, mode: "demo" };
    }
    // Fallback: create a demo workspace on the fly
    const ws = await prisma.workspace.upsert({
        where: { slug: "default-workspace" },
        update: {},
        create: { name: "Default Workspace", slug: "default-workspace" },
    });
    return { workspaceId: ws.id, userId: null, mode: "demo" };
}

/**
 * Resolve a microapp's UUID from its slug.
 * Creates the microapp record if missing (self-healing).
 */
export async function resolveMicroappId(slug: string): Promise<string> {
    const app = await prisma.microapp.findUnique({ where: { slug } });
    if (app) return app.id;
    // Self-healing: create if missing
    const created = await prisma.microapp.create({
        data: { slug, name: slug, description: `Auto-created microapp: ${slug}` },
    });
    return created.id;
}

/**
 * Resolve BYOK keys from workspace LLM keys table.
 */
export async function resolveByokKeys(workspaceId: string): Promise<{
    provider?: string;
    apiKey?: string;
} | null> {
    const keys = await prisma.llmKey.findMany({ where: { workspaceId } });
    if (keys.length === 0) return null;
    // Prefer gemini > openai > anthropic > first
    const preferred = keys.find(k => k.provider === "gemini")
        || keys.find(k => k.provider === "openai")
        || keys.find(k => k.provider === "anthropic")
        || keys[0];
    return {
        provider: preferred.provider,
        apiKey: Buffer.from(preferred.encryptedKey, "base64").toString("ascii"),
    };
}
