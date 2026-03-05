import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ALL_TOOLS = [
    { slug: "email-subject", name: "Email Subject Line Generator", description: "Generate high-converting email subject lines." },
    { slug: "tweet-thread", name: "Tweet Thread Writer", description: "Convert an idea into a 5-tweet thread." },
    { slug: "seo-meta", name: "SEO Meta Description", description: "Generate SEO meta descriptions." },
    { slug: "blog-outline", name: "Blog Post Outline", description: "Create a structured outline for your blog post." },
    { slug: "youtube-ideas", name: "YouTube Video Ideas", description: "Brainstorm YouTube video concepts." },
    { slug: "product-desc", name: "Product Description Writer", description: "Write compelling product descriptions." },
    { slug: "ad-copy", name: "Ad Copy Generator", description: "Generate Facebook Ad copy." },
    { slug: "cold-email", name: "Cold Outreach Email", description: "Write a B2B cold email." },
    { slug: "press-release", name: "Press Release Draft", description: "Draft a standard press release." },
    { slug: "cover-letter", name: "Cover Letter Builder", description: "Generate a cover letter." },
    { slug: "welcome-email", name: "Welcome Email Sequence", description: "Draft a 3-part welcome email sequence." },
    { slug: "sales-script", name: "Sales Script", description: "Generate a cold-calling script." },
    { slug: "interview-qa", name: "Interview Questions", description: "Generate interview questions for a role." },
    { slug: "user-persona", name: "User Persona Creator", description: "Create a detailed user persona." },
    { slug: "faq-gen", name: "FAQ Generator", description: "Generate FAQs for a webpage." },
    { slug: "slogan-maker", name: "Slogan Maker", description: "Create catchy brand slogans." },
    { slug: "value-prop", name: "Value Prop Canvas", description: "Define a value proposition." },
    { slug: "test-rewrite", name: "Testimonial Rewriter", description: "Polish up rough user reviews." },
    { slug: "job-desc", name: "Job Description Writer", description: "Write a compelling job posting." },
    { slug: "mission", name: "Mission Statement", description: "Draft a corporate mission statement." },
    { slug: "elevator-pitch", name: "Elevator Pitch", description: "Create a 30-second elevator pitch." },
    { slug: "namer", name: "Naming Assistant", description: "Brainstorm project names." },
    { slug: "course-curriculum", name: "Course Curriculum", description: "Outline an online course." },
    { slug: "podcast-intro", name: "Podcast Intro", description: "Write a script for a podcast intro." },
    { slug: "landing-page", name: "Landing Page Copy", description: "Draft copy for a hero section." },
    { slug: "newsletter", name: "Newsletter Ideas", description: "Generate weekly newsletter topics." },
    { slug: "eli5", name: "Rewrite for 5yo", description: "Simplify complex text (ELI5)." },
    { slug: "code-explain", name: "Code Explainer", description: "Explain a snippet of code." },
    { slug: "regex-gen", name: "Regex Generator", description: "Generate Regular Expressions." },
    { slug: "sql-gen", name: "SQL Query Builder", description: "Convert English to SQL." },
    // Original 3 (ensure they exist)
    { slug: "resume", name: "Resume Bullet Factory", description: "Generate resume bullets." },
    { slug: "prd2jira", name: "PRD → Tickets", description: "Convert PRDs to Jira tickets." },
    { slug: "meeting", name: "Notes → Actions", description: "Extract action items from notes." },
];

async function main() {
    // Create admin user
    const user = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: { email: "admin@example.com", name: "Admin User" },
    });

    // Create workspace + membership
    const workspace = await prisma.workspace.upsert({
        where: { slug: "default-workspace" },
        update: {},
        create: {
            name: "Default Workspace",
            slug: "default-workspace",
            memberships: { create: { userId: user.id, role: "admin" } },
        },
    });

    // Workspace config
    await prisma.workspaceConfig.upsert({
        where: { workspaceId: workspace.id },
        update: {},
        create: {
            workspaceId: workspace.id,
            featureFlagsJson: JSON.stringify({ enableBetaFeatures: true, limitRuns: false }),
        },
    });

    // Register ALL 30+ microapps and install them
    for (const app of ALL_TOOLS) {
        const microapp = await prisma.microapp.upsert({
            where: { slug: app.slug },
            update: { name: app.name, description: app.description },
            create: { slug: app.slug, name: app.name, description: app.description },
        });

        await prisma.microappInstall.upsert({
            where: { workspaceId_microappId: { workspaceId: workspace.id, microappId: microapp.id } },
            update: {},
            create: { workspaceId: workspace.id, microappId: microapp.id, enabled: true },
        });
    }

    console.log(`✅ Database seeded: ${ALL_TOOLS.length} microapps registered and installed.`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
