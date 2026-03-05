import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            email: "admin@example.com",
            name: "Admin User",
        },
    });

    const workspace = await prisma.workspace.upsert({
        where: { slug: "default-workspace" },
        update: {},
        create: {
            name: "Default Workspace",
            slug: "default-workspace",
            memberships: {
                create: {
                    userId: user.id,
                    role: "admin",
                },
            },
        },
    });

    await prisma.workspaceConfig.upsert({
        where: { workspaceId: workspace.id },
        update: {},
        create: {
            workspaceId: workspace.id,
            featureFlagsJson: JSON.stringify({ enableBetaFeatures: true, limitRuns: false }),
        },
    });

    const apps = [
        { slug: "resume", name: "Resume Bullet Factory", description: "Generate resume bullets." },
        { slug: "prd2jira", name: "PRD -> Tickets", description: "Convert PRDs to Jira tickets." },
        { slug: "meeting", name: "Notes -> Actions", description: "Extract action items from notes." },
    ];

    for (const app of apps) {
        const microapp = await prisma.microapp.upsert({
            where: { slug: app.slug },
            update: { name: app.name, description: app.description },
            create: {
                slug: app.slug,
                name: app.name,
                description: app.description,
            },
        });

        await prisma.microappInstall.upsert({
            where: {
                workspaceId_microappId: {
                    workspaceId: workspace.id,
                    microappId: microapp.id,
                },
            },
            update: {},
            create: {
                workspaceId: workspace.id,
                microappId: microapp.id,
                enabled: true,
            },
        });
    }

    console.log("Database seeded successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
