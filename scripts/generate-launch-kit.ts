import fs from "fs-extra";
import path from "path";

const LAUNCH_KIT_DIR = path.resolve(__dirname, "../../launch-kit");
const BASE_DOCS_DIR = path.resolve(__dirname, "../../docs");

async function generateLaunchKit() {
    console.log("🚀 Generating Launch Kit from the MicroSaaS Factory...");

    await fs.ensureDir(LAUNCH_KIT_DIR);

    // 1. Generate Product Hunt Launch Template
    const phTemplate = `# Product Hunt Launch Template

## Tagline
(Short & punchy, under 60 chars) e.g. "Generate ATS-friendly resumes in seconds with AI"

## Description
(2-3 short sentences about what it does and who it's for)

## First Comment / Maker's Comment
Hey Product Hunt! 👋 I'm [Your Name], the maker of [MicroApp Name].

I built this because [problem you faced]. It solves it by [how it works].
Features:
- [Feature 1]
- [Feature 2]
- [Feature 3]

Would love to hear your feedback! Let me know in the comments below.

## Launch Assets Required
- [ ] 1x Gallery Image (1270x760 or 2540x1520)
- [ ] 1x Square Logo (240x240 minimum)
- [ ] 1x Video Demo (Optional but recommended)
`;
    await fs.writeFile(path.join(LAUNCH_KIT_DIR, "product-hunt-template.md"), phTemplate, "utf8");
    console.log("✅ Created Product Hunt Template");

    // 2. Generate Twitter/X Thread Template
    const twitterTemplate = `🚀 Just launched [MicroApp Name]!

Tired of [problem]? Me too. That's why I built a highly focused tool to solve it using AI.

Here's how it works 👇

🧵 1/5

---

**Step 1:** [Input mechanism - e.g. "Paste your notes here"]
[Screenshot of input UI]

🧵 2/5

---

**Step 2:** [Processing/Magic - e.g. "AI extracts the required actions"]
It runs on [technology/model], so it's crazy fast.

🧵 3/5

---

**Step 3:** [Output - e.g. "Export straight to Jira or download as CSV"]
[Screenshot of output]

🧵 4/5

---

Built entirely on the MicroSaaS Factory. Shipped from idea to production in [X] days.

Try it out here: [Link to app]
Would love your feedback! Let me know what you think below. RTs appreciated! 🙏

🧵 5/5
`;
    await fs.writeFile(path.join(LAUNCH_KIT_DIR, "twitter-thread-template.md"), twitterTemplate, "utf8");
    console.log("✅ Created Twitter Thread Template");

    // 3. Generate Indie Hackers Post Template
    const ihTemplate = `# How I built and launched [MicroApp Name] in a weekend

Hey IHers,

I recently launched [MicroApp Name], a tool that [what it does].

### The Idea
I was struggling with [problem] and realized there wasn't a simple, single-purpose tool for it without paying a hefty subscription.

### The Stack
I used the MicroSaaS Factory monorepo:
- Next.js (App Router)
- Tailwind + shadcn/ui
- Prisma + SQLite (local-first)
- Vercel AI SDK

### The Launch
I launched it on [Product Hunt / X / Reddit] and here were the results:
- [Metric 1]
- [Metric 2]

What do you guys think of the idea? Any feedback on the landing page?
Link: [URL]
`;
    await fs.writeFile(path.join(LAUNCH_KIT_DIR, "indie-hackers-template.md"), ihTemplate, "utf8");
    console.log("✅ Created Indie Hackers Template");

    // Check if docs/microapps-30.json exists, if so mention it
    const stubJsonPath = path.join(BASE_DOCS_DIR, "microapps-30.json");
    if (await fs.pathExists(stubJsonPath)) {
        console.log("✅ Found microapps-30.json - You have 30 ideas ready to launch!");
    } else {
        console.log("⚠️ microapps-30.json not found in docs. Make sure you generate stubs first.");
    }

    console.log("\n🎉 Launch Kit generated successfully in /launch-kit!");
}

generateLaunchKit().catch(console.error);
