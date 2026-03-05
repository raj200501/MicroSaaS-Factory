import fs from "fs";
import path from "path";

const microappsPath = path.join(__dirname, "../docs/microapps-30.json");
const apps = JSON.parse(fs.readFileSync(microappsPath, "utf8")) as Array<{ name: string; slug: string; description: string }>;
const outputDir = path.join(__dirname, "../docs/launch");

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// LinkedIn Posts
const linkedinPosts = apps.map((app, i) => `
## Post ${i + 1}: ${app.name}

🚀 Just shipped: **${app.name}**

${app.description}

Built it as part of MicroSaaS Factory — an open-source platform with 30+ AI microapps.

No paid SaaS. No vendor lock-in. Just clone, run, and ship.

What microapp would save YOU 2 hours this week?

🔗 Try it: github.com/raj200501/MicroSaaS-Factory

#buildinpublic #opensource #ai #saas #microapps
`).join("\n---\n");
fs.writeFileSync(path.join(outputDir, "30_linkedin_posts.md"), `# LinkedIn Posts\n\n30 ready-to-post LinkedIn updates for building in public.\n${linkedinPosts}`);

// Showcase Threads
const threads = apps.slice(0, 10).map((app, i) => `
## Thread ${i + 1}: ${app.name}

**Tweet 1:** 🧵 I built ${app.name} in 30 minutes using MicroSaaS Factory.

Here's what it does and how you can build one too ↓

**Tweet 2:** ${app.description}

It uses Next.js Server Actions + a DummyProvider so you don't even need an API key to test.

**Tweet 3:** The architecture: Turborepo monorepo → shared packages (auth, db, llm, ui) → individual microapp that just focuses on its ONE job.

**Tweet 4:** Want to build your own? One command:

git clone https://github.com/raj200501/MicroSaaS-Factory && pnpm install && pnpm dev

**Tweet 5:** This is part of a 30+ microapp platform. All open source. Zero paid SaaS.

⭐ Star it: github.com/raj200501/MicroSaaS-Factory
`).join("\n---\n");
fs.writeFileSync(path.join(outputDir, "10_showcase_threads.md"), `# X/Twitter Showcase Threads\n\n10 tweet threads showcasing individual microapps.\n${threads}`);

// Product Hunt Blurbs
const phBlurbs = apps.slice(0, 10).map((app, i) => `
## ${i + 1}. ${app.name}

**Tagline:** ${app.description}

**Description:**
${app.name} is one of 30+ AI microapps in MicroSaaS Factory — an open-source platform that lets you build and ship single-purpose AI tools in minutes.

No monthly fees. No vendor lock-in. Bring your own API key or use the built-in dummy provider for free.

**First Comment:**
Hey PH! 👋 I built MicroSaaS Factory because I was tired of setting up the same boilerplate for every AI tool I wanted to build. Now it's a platform with 30+ tools and counting. Would love your feedback!
`).join("\n---\n");
fs.writeFileSync(path.join(outputDir, "10_producthunt_blurbs.md"), `# Product Hunt Blurbs\n\n10 ready-to-submit Product Hunt descriptions.\n${phBlurbs}`);

// Press Kit
const pressKit = `# MicroSaaS Factory — Press Kit

## One-Liner
Open-source platform to build, ship, and monetize 30+ AI-powered microapps with zero paid SaaS dependencies.

## Problem
Developers waste weeks on boilerplate (auth, database, UI, LLM integration) before they can even start building their AI tool idea.

## Solution
MicroSaaS Factory is a production-ready monorepo with everything pre-wired: authentication, database, LLM abstraction, shared UI components, and 30+ microapp templates. Clone it, customize it, ship it.

## Key Features
- **30+ AI Microapps** — from Resume Builder to SQL Generator
- **Zero Paid SaaS** — runs entirely on local SQLite
- **BYOK LLM** — bring OpenAI/Anthropic keys or use free DummyProvider
- **Monorepo Architecture** — Turborepo + pnpm workspaces
- **Server Actions** — clean, type-safe AI generation
- **3 Fully Functional Apps** — Resume Builder, PRD→Jira, Meeting Notes

## Tech Stack
Next.js 14, TypeScript, Prisma, SQLite, Turborepo, pnpm, Tailwind CSS, Vercel AI SDK

## Links
- GitHub: https://github.com/raj200501/MicroSaaS-Factory
- Website: https://microsaas.dev

## FAQs

**Q: Is this really free?**
A: Yes. Personal use is MIT licensed. Commercial use requires a one-time license.

**Q: Do I need API keys?**
A: No. The DummyProvider works without any keys. Add OpenAI or Anthropic keys when you're ready.

**Q: Can I deploy this?**
A: Yes. Works on Vercel, Cloudflare Pages, or any Node.js host. Zero external services needed.

**Q: How do I make money with this?**
A: Use it as a foundation for your own SaaS. Each microapp can be a standalone product.
`;
fs.writeFileSync(path.join(outputDir, "press_kit.md"), pressKit);

console.log(`✅ Launch kit generated in docs/launch/`);
console.log(`   - 30_linkedin_posts.md`);
console.log(`   - 10_showcase_threads.md`);
console.log(`   - 10_producthunt_blurbs.md`);
console.log(`   - press_kit.md`);
