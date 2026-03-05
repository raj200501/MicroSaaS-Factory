"use server";

import { z } from "zod";
import { generateText, resolveProvider } from "@microsaas/llm";
import { checkRateLimit, recordUsage, getCachedResponse, setCachedResponse } from "@microsaas/llm";
import { prisma, resolveWorkspace, resolveMicroappId, resolveByokKeys } from "@microsaas/db";
import { getSession } from "@microsaas/auth";
import { headers } from "next/headers";
import { getToolBySlug } from "./tool-defs";

export async function runTool(slug: string, inputs: Record<string, string>) {
    const t0 = Date.now();
    const tool = getToolBySlug(slug);
    if (!tool) return { error: `Unknown tool: ${slug}` };

    // Validate inputs
    for (const input of tool.inputs) {
        if (!inputs[input.name]?.trim()) {
            return { error: `Please fill in: ${input.label}` };
        }
    }

    const session = await getSession();
    const headersList = headers();
    const clientIp = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    const ctx = await resolveWorkspace(session?.userId || null);
    const microappId = await resolveMicroappId(slug);
    const byok = ctx.mode === "authenticated" ? await resolveByokKeys(ctx.workspaceId) : null;
    const resolved = resolveProvider(byok?.provider as any, byok?.apiKey);

    // Rate limit
    if (resolved.badge !== "BYOK") {
        const rl = await checkRateLimit(clientIp);
        if (!rl.allowed) return { error: rl.message, rateLimited: true };
    }

    // Build prompt from inputs
    const inputLines = tool.inputs.map(i => `${i.label}: ${inputs[i.name]}`).join("\n");
    const prompt = `${inputLines}\n\nProvide the output as: ${tool.outputDescription}`;

    // Check cache
    const schemaFP = `tool-${slug}-v1`;
    const cached = await getCachedResponse(resolved.provider, resolved.model || "", tool.systemPrompt, prompt, schemaFP);
    if (cached) {
        return { output: cached, provider: resolved.badge, latencyMs: Date.now() - t0, cached: true };
    }

    let output: string | null = null;
    let errorMsg: string | null = null;

    try {
        if (resolved.provider === "dummy") {
            // Generate deterministic fake output based on tool type
            output = generateDummyOutput(tool.slug, tool.outputDescription, inputs);
        } else {
            output = await generateText({
                provider: resolved.provider,
                apiKey: resolved.apiKey,
                model: resolved.model,
                system: tool.systemPrompt,
                prompt,
                temperature: 0.7,
            });
        }
    } catch (e: any) {
        errorMsg = e.message || "Unknown LLM error";
    }

    const latencyMs = Date.now() - t0;

    // Record usage
    if (resolved.badge !== "BYOK" && !errorMsg) await recordUsage(clientIp);

    // Cache result
    if (output && resolved.provider !== "dummy") {
        await setCachedResponse(resolved.provider, resolved.model || "", tool.systemPrompt, prompt, schemaFP, output);
    }

    // Persist
    try {
        await prisma.event.create({
            data: {
                workspaceId: ctx.workspaceId, microappId, userId: ctx.userId, action: "run_tool",
                metadata: JSON.stringify({ latencyMs, provider: resolved.badge })
            }
        });
        await prisma.microappRun.create({
            data: {
                workspaceId: ctx.workspaceId, userId: ctx.userId, microappId,
                inputJson: JSON.stringify(inputs),
                outputJson: output ? output.slice(0, 10000) : null,
                provider: resolved.provider, latencyMs, status: errorMsg ? "error" : "success", errorMessage: errorMsg
            }
        });
    } catch (_) {
        // Non-fatal: DB write errors shouldn't break the tool
    }

    if (errorMsg) return { error: errorMsg };
    return { output, provider: resolved.badge, latencyMs };
}

// Deterministic dummy output generator — produces realistic content without any API calls
function generateDummyOutput(slug: string, outputDesc: string, inputs: Record<string, string>): string {
    const firstInput = Object.values(inputs)[0] || "example";

    const templates: Record<string, () => string> = {
        "email-subject": () => [
            `🔥 "${firstInput}" — Here's What You're Missing`,
            `⏰ Last chance: ${firstInput} (expires tonight)`,
            `The #1 mistake people make with ${firstInput}`,
            `We need to talk about ${firstInput}...`,
            `[Case Study] How we 3x'd results with ${firstInput}`,
        ].map((s, i) => `${i + 1}. ${s}`).join("\n"),

        "seo-meta": () => [
            `Discover the best strategies for ${firstInput}. Our comprehensive guide covers everything you need. Click to learn more.`,
            `Looking for ${firstInput}? Expert tips, proven methods, and actionable insights. Start optimizing today.`,
            `${firstInput} made simple. Real results, practical advice. See why 10,000+ professionals trust our approach.`,
        ].map((s, i) => `Meta ${i + 1}: ${s}`).join("\n\n"),

        "tweet-thread": () => [
            `🧵 Thread: Everything I've learned about ${firstInput}\n\nThis changed how I think about everything. Here's the breakdown 👇`,
            `1/ The biggest misconception about ${firstInput} is that it's complicated.\n\nIt's not. Here's the simple framework:`,
            `2/ Step 1: Start with the fundamentals.\n\n${firstInput} isn't a "hack" — it's a skill. And skills compound.`,
            `3/ Step 2: Focus on consistency over intensity.\n\nThe people who win at ${firstInput} show up every single day.`,
            `4/ Step 3: Measure what matters.\n\nStop tracking vanity metrics. Focus on outcomes.\n\n🔄 Repost if this helped!\n📌 Follow for more on ${firstInput}`,
        ].join("\n\n---\n\n"),

        "cold-email": () => `Subject: Quick question about ${firstInput}\n\nHi [Name],\n\nI noticed that your team is focused on ${firstInput}. We helped [Similar Company] achieve 40% better results in just 3 months.\n\nWould you be open to a 15-minute chat this week to see if we could do the same for you?\n\nBest,\n[Your Name]`,

        "blog-outline": () => `# How to Master ${firstInput}: A Complete Guide\n\n## 1. Introduction\n- Why ${firstInput} matters in 2024\n- Common challenges and misconceptions\n\n## 2. Getting Started\n- Prerequisites and setup\n- Quick wins to build momentum\n\n## 3. Core Strategies\n- Strategy A: The foundation approach\n- Strategy B: Advanced techniques\n- Strategy C: Scaling what works\n\n## 4. Real-World Examples\n- Case study: 3x results in 90 days\n- Lessons from industry leaders\n\n## 5. Tools & Resources\n- Free tools to get started\n- Paid solutions for scaling\n\n## 6. Conclusion\n- Key takeaways\n- Next steps and action items`,

        "ad-copy": () => `**Ad 1 — The Problem-Solution**\nHeadline: Still struggling with ${firstInput}?\nBody: Join 10,000+ professionals who solved this in minutes. Our proven approach delivers results — guaranteed.\nCTA: Get Started Free →\n\n**Ad 2 — The Social Proof**\nHeadline: "This changed everything" — 5-star rated\nBody: See why ${firstInput} users are switching. 40% faster. 60% cheaper. 100% satisfaction.\nCTA: Try It Now →\n\n**Ad 3 — The Urgency**\nHeadline: ${firstInput} — Limited time offer\nBody: First 100 signups get lifetime access. Don't miss the early adopter advantage.\nCTA: Claim Your Spot →`,

        "product-desc": () => `# ${firstInput}\n\n**Transform your workflow with the next generation of ${firstInput}.**\n\nDesigned for professionals who demand the best, this ${firstInput} combines cutting-edge technology with intuitive design.\n\n✅ **Premium Quality** — Built with the finest materials for lasting performance\n✅ **Effortless Experience** — Setup in under 2 minutes, no expertise needed\n✅ **Proven Results** — Trusted by 10,000+ customers worldwide\n\n*"The best ${firstInput} I've ever used. Worth every penny."* — Sarah K., verified buyer\n\n→ **Order now and get free shipping**`,

        "resume": () => `**Impact Bullets:**\n• Spearheaded development of ${firstInput} platform, increasing team velocity by 40% and reducing deployment time from 4 hours to 15 minutes\n• Architected microservice migration serving 2M+ daily requests with 99.99% uptime and sub-50ms P95 latency\n• Led cross-functional team of 8 engineers, delivering 3 major product launches on schedule and $2M under budget\n• Optimized database query performance, reducing average response time by 65% and saving $120K/year in infrastructure costs\n\n**Concise Bullets:**\n• Built and shipped ${firstInput} — 2M+ daily users, 99.99% uptime\n• Led 8-person team to deliver 3 major launches on time\n• Cut deployment time 16x (4h → 15min) through CI/CD automation\n• Reduced infrastructure costs by $120K/year via performance optimization\n\n**Technical Bullets:**\n• Designed event-driven architecture using Kafka, Redis, and PostgreSQL handling 50K events/sec\n• Implemented comprehensive test suite (unit, integration, E2E) achieving 94% code coverage\n• Built real-time analytics pipeline processing 500GB/day with Apache Spark and ClickHouse\n• Created internal CLI tooling in Go, adopted by 40+ engineers across 5 teams`,

        "cover-letter": () => `Dear Hiring Manager,\n\nI'm excited to apply for the ${firstInput} position. With over 5 years of experience building scalable systems and leading high-performing teams, I'm confident I can make an immediate impact on your team.\n\nIn my current role, I led the development of a platform serving millions of users, reducing deployment times by 16x and saving $120K annually in infrastructure costs. I thrive in environments that value both technical excellence and collaborative problem-solving.\n\nI'd love the opportunity to bring my passion for building great products to your team. I'm available for an interview at your convenience and look forward to hearing from you.\n\nBest regards`,

        "sales-script": () => `**Opening:**\nHi [Name], this is [Your Name] from [Company]. I know you weren't expecting my call — do you have 30 seconds? I'll be brief.\n\n**Discovery:**\n• "What's your current process for ${firstInput}?"\n• "How much time does your team spend on this weekly?"\n• "If you could change one thing about it, what would it be?"\n\n**Pitch:**\nWe help companies like yours automate ${firstInput}, saving an average of 10 hours per week and reducing errors by 80%.\n\n**Objection Handling:**\n• "Too expensive" → "What's the cost of NOT solving this? Most clients see ROI in 3 weeks."\n• "We have a solution" → "Totally understand. How happy are you with the results on a 1-10 scale?"\n• "Send me info" → "Absolutely. But to send you the right case study, can I ask one question?"\n\n**Close:**\nCan I set up a 15-minute demo with your team this Thursday or Friday?`,

        "interview-qa": () => `**Behavioral Questions:**\n1. Tell me about a time you had to make a difficult technical decision under pressure as a ${firstInput}.\n2. Describe a project where you had to collaborate with non-technical stakeholders.\n3. How do you handle disagreements within your team about technical approaches?\n4. Tell me about a time you mentored a junior developer.\n5. Describe your biggest professional failure and what you learned.\n\n**Technical Questions:**\n6. Walk me through how you would design a scalable notification system.\n7. What's the difference between SQL and NoSQL databases? When would you choose each?\n8. How do you approach performance optimization in a production system?\n9. Explain the concept of eventual consistency and when it's acceptable.\n10. How would you implement rate limiting for an API?`,
    };

    const generator = templates[slug];
    if (generator) return generator();

    // Generic fallback for tools without specific templates
    return `## ${outputDesc}\n\nBased on your input about "${firstInput}":\n\n**Key Insights:**\n\n1. **Primary Recommendation:** Focus on establishing a clear strategy around ${firstInput}. This is the foundation for everything else.\n\n2. **Quick Win:** Start by identifying your top 3 priorities related to ${firstInput} and create measurable goals for each.\n\n3. **Long-term Approach:** Build a systematic process that compounds results over time. Consistency beats intensity.\n\n4. **Common Pitfall to Avoid:** Don't try to do everything at once. Start focused, then expand based on what works.\n\n5. **Pro Tip:** The best results come from combining ${firstInput} with regular feedback loops and iteration.\n\n---\n*Generated by MicroSaaS Factory (DummyProvider)*\n*Add your API key in Studio → LLM Keys for AI-powered results.*`;
}
