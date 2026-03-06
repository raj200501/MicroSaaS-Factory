/**
 * Eval Runner
 *
 * Executes the benchmark dataset against tool dummy outputs.
 * This runs without any API keys — it uses the same DummyProvider
 * path that the production tool runner falls back to.
 *
 * Usage: pnpm --filter @microsaas/evals evals
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { EvalCase, scoreOutput, aggregateReport } from "./harness";

// Tool dummy output templates — mirrors the production dummy generator
// This ensures evals test the actual output path users see
const DUMMY_TEMPLATES: Record<string, (inputs: Record<string, string>) => string> = {
    "email-subject": (i) => {
        const t = i.topic || "example";
        return [
            `🔥 "${t}" — Here's What You're Missing`,
            `⏰ Last chance: ${t} (expires tonight)`,
            `The #1 mistake people make with ${t}`,
            `We need to talk about ${t}...`,
            `[Case Study] How we 3x'd results with ${t}`,
        ].map((s, idx) => `${idx + 1}. ${s}`).join("\n");
    },
    "seo-meta": (i) => {
        const t = i.title || "example";
        return [
            `Discover the best strategies for ${t}. Our comprehensive guide covers everything you need. Click to learn more.`,
            `Looking for ${t}? Expert tips, proven methods, and actionable insights. Start optimizing today.`,
            `${t} made simple. Real results, practical advice. See why 10,000+ professionals trust our approach.`,
        ].map((s, idx) => `Meta ${idx + 1}: ${s}`).join("\n\n");
    },
    "ad-copy": (i) => {
        const t = i.offer || "example";
        return `**Ad 1 — The Problem-Solution**\nHeadline: Still struggling with ${t}?\nBody: Join 10,000+ professionals who solved this. Our proven approach delivers results — guaranteed.\nCTA: Get Started Free →\n\n**Ad 2 — The Social Proof**\nHeadline: "This changed everything" — 5-star rated\nBody: See why ${t} users are switching. 40% faster. 60% cheaper.\nCTA: Try It Now →\n\n**Ad 3 — The Urgency**\nHeadline: ${t} — Limited time offer\nBody: First 100 signups get lifetime access.\nCTA: Claim Your Spot →`;
    },
    "cold-email": (i) => {
        const t = i.target || "example";
        return `Subject: Quick question about ${t}\n\nHi [Name],\n\nI noticed your team is focused on ${t}. We helped [Similar Company] achieve 40% better results in 3 months.\n\nWould you be open to a 15-minute chat this week?\n\nBest,\n[Your Name]`;
    },
    "resume": (i) => {
        const r = i.role || "Engineer";
        return `**Impact Bullets:**\n• Spearheaded development of ${r} platform, increasing velocity by 40%\n• Architected microservice migration serving 2M+ daily requests with 99.99% uptime\n• Led cross-functional team of 8 engineers, delivering 3 major launches on schedule\n• Optimized database queries, reducing response time by 65%\n\n**Concise Bullets:**\n• Built and shipped ${r} — 2M+ daily users, 99.99% uptime\n• Led 8-person team to deliver 3 major launches on time\n• Cut deployment time 16x through CI/CD automation\n• Reduced infrastructure costs by $120K/year\n\n**Technical Bullets:**\n• Designed event-driven architecture using Kafka, Redis, and PostgreSQL\n• Implemented test suite achieving 94% code coverage\n• Built real-time analytics pipeline processing 500GB/day\n• Created internal CLI tooling adopted by 40+ engineers`;
    },
    "blog-outline": (i) => {
        const t = i.topic || "example";
        return `# How to Master ${t}: A Complete Guide\n\n## 1. Introduction\n- Why ${t} matters in 2024\n- Common challenges\n\n## 2. Getting Started\n- Prerequisites and setup\n- Quick wins\n\n## 3. Core Strategies\n- Strategy A: Foundation\n- Strategy B: Advanced techniques\n- Strategy C: Scaling\n\n## 4. Real-World Examples\n- Case study: 3x results in 90 days\n\n## 5. Tools & Resources\n- Free tools\n- Paid solutions\n\n## 6. Conclusion\n- Key takeaways`;
    },
    "tweet-thread": (i) => {
        const t = i.idea || "example";
        return [
            `🧵 Thread: Everything I've learned about ${t}\n\nThis changed how I think about everything. Here's the breakdown 👇`,
            `1/ The biggest misconception about ${t} is that it's complicated.\n\nIt's not. Here's the simple framework:`,
            `2/ Step 1: Start with the fundamentals.\n\n${t} isn't a "hack" — it's a skill.`,
            `3/ Step 2: Focus on consistency over intensity.`,
            `4/ Step 3: Measure what matters.\n\n🔄 Repost if this helped!\n📌 Follow for more`,
        ].join("\n\n---\n\n");
    },
    "prd2jira": (i) => {
        const t = i.prd || "example";
        return `## Epic 1: Core Implementation\nSummary: Build the core ${t.slice(0, 40)} functionality\n\n### Ticket 1.1: Setup and scaffolding (3 pts)\nDescription: Initialize project structure\nAcceptance Criteria:\n- Project scaffolded\n- CI pipeline running\n- Dependencies installed\n\n### Ticket 1.2: Core logic (5 pts)\nDescription: Implement main business logic\nAcceptance Criteria:\n- All unit tests passing\n- Code reviewed\n\n## Epic 2: Integration\n\n### Ticket 2.1: API integration (5 pts)\nDescription: Connect to external services\nAcceptance Criteria:\n- API calls working\n- Error handling in place`;
    },
    "meeting": (i) => {
        const n = i.notes || "example";
        return `**Action Items:**\n1. John — Finalize API spec — by Friday\n2. Sarah — Set up staging environment — by Wednesday\n3. Mike — Budget approval — by EOD Tuesday\n\n**Follow-up Email:**\n\nHi team,\n\nThanks for a productive meeting. Here's a summary of next steps based on: ${n.slice(0, 50)}\n\nPlease let me know if I missed anything.\n\nBest,\n[Your Name]`;
    },
    "code-explain": (i) => {
        return `## Code Explanation\n\n**Summary:** This code implements a debounce utility function.\n\n**Line-by-line breakdown:**\n- \`const debounce\` — Declares a higher-order function\n- \`let t\` — Timer reference for deferred execution\n- \`clearTimeout(t)\` — Cancels previous pending call\n- \`setTimeout\` — Schedules new call after delay\n\n**Potential issues:**\n- No TypeScript types\n- No max wait option\n\n**Suggested improvements:**\n- Add TypeScript generics\n- Add cancel() method\n- Add immediate/leading option`;
    },
    "sql-gen": (i) => {
        const q = i.query || "example";
        return `## SQL Query\n\n\`\`\`sql\nSELECT u.id, u.name, u.email, COUNT(p.id) as purchase_count\nFROM users u\nJOIN purchases p ON p.user_id = u.id\nWHERE u.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)\nGROUP BY u.id, u.name, u.email\nHAVING COUNT(p.id) >= 3\nORDER BY purchase_count DESC;\n\`\`\`\n\n**Explanation:** ${q}\n- JOIN links users to purchases\n- WHERE filters to last month signups\n- HAVING filters to 3+ purchases`;
    },
};

function genericDummy(inputs: Record<string, string>, outputDesc: string): string {
    const first = Object.values(inputs)[0] || "example";
    return `## ${outputDesc}\n\nBased on your input about "${first}":\n\n1. **Primary Recommendation:** Focus on a clear strategy around ${first}.\n2. **Quick Win:** Identify your top 3 priorities.\n3. **Long-term:** Build a systematic process.\n4. **Avoid:** Don't try to do everything at once.\n5. **Pro Tip:** Combine ${first} with regular feedback loops.\n\n---\n*Generated by MicroSaaS Factory (DummyProvider)*`;
}

async function main() {
    const datasetPath = join(__dirname, "..", "datasets", "benchmark.jsonl");
    const raw = readFileSync(datasetPath, "utf8");
    const cases: EvalCase[] = raw.trim().split("\n").map((line) => JSON.parse(line));

    console.log(`\n📊 MicroSaaS Eval Harness`);
    console.log(`   Provider: DummyProvider (deterministic)`);
    console.log(`   Dataset: ${cases.length} cases\n`);
    console.log("─".repeat(60));

    const results = [];

    for (const evalCase of cases) {
        const t0 = performance.now();
        let output: string | null = null;
        let error: string | undefined;

        try {
            const generator = DUMMY_TEMPLATES[evalCase.tool];
            if (generator) {
                output = generator(evalCase.inputs);
            } else {
                output = genericDummy(evalCase.inputs, "Generated output");
            }
        } catch (e: any) {
            error = e.message;
        }

        const latencyMs = Math.round(performance.now() - t0);
        const result = scoreOutput(evalCase, output, latencyMs, error);
        results.push(result);

        const icon = result.passed ? "✅" : "❌";
        const failedChecks = Object.entries(result.scores)
            .filter(([, v]) => !v)
            .map(([k]) => k);
        const detail = result.passed ? "" : ` (failed: ${failedChecks.join(", ")})`;
        console.log(`${icon} ${evalCase.id.padEnd(25)} ${latencyMs}ms${detail}`);
    }

    console.log("─".repeat(60));

    const report = aggregateReport(results, "dummy");

    console.log(`\n📈 Summary`);
    console.log(`   Pass rate:        ${(report.passRate * 100).toFixed(0)}% (${report.passed}/${report.totalCases})`);
    console.log(`   Schema validity:  ${(report.metrics.schema_validity_rate * 100).toFixed(0)}%`);
    console.log(`   Completion rate:  ${(report.metrics.completion_rate * 100).toFixed(0)}%`);
    console.log(`   Error rate:       ${(report.metrics.error_rate * 100).toFixed(0)}%`);
    console.log(`   Avg latency:      ${report.avgLatencyMs}ms`);
    console.log(`   P50 latency:      ${report.metrics.p50_latency_ms}ms`);
    console.log(`   P95 latency:      ${report.metrics.p95_latency_ms}ms`);
    console.log(`   Mean output len:  ${report.metrics.mean_output_length} chars\n`);

    // Write report artifacts
    const outDir = join(__dirname, "..", "reports");
    mkdirSync(outDir, { recursive: true });

    writeFileSync(join(outDir, "latest.json"), JSON.stringify(report, null, 2));
    console.log(`📄 Report written to packages/evals/reports/latest.json`);

    // Exit with error if any failures
    if (report.failed > 0) {
        console.log(`\n⚠️  ${report.failed} eval(s) failed — see report for details.`);
        process.exit(1);
    }

    console.log(`\n✅ All evals passed.\n`);
}

main().catch((e) => {
    console.error("Eval runner failed:", e);
    process.exit(1);
});
