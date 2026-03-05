import Link from "next/link";
import { TOOLS, TOOL_CATEGORIES } from "./tools/_lib/tool-defs";

const stats = [
    { value: "30+", label: "AI Microapps" },
    { value: "0", label: "Paid Dependencies" },
    { value: "1", label: "Command Setup" },
    { value: "∞", label: "Possibilities" },
];

const features = [
    {
        icon: "🧠",
        title: "BYOK LLM Support",
        description: "Bring your own OpenAI, Gemini, or Anthropic key — or use DummyProvider for free local dev.",
    },
    {
        icon: "🗄️",
        title: "Local SQLite Database",
        description: "No external database needed. Everything runs locally with Prisma + SQLite. Zero infrastructure costs.",
    },
    {
        icon: "🔐",
        title: "Built-in Auth & Sessions",
        description: "Cookie-based authentication with Edge middleware. Secure by default, zero third-party providers.",
    },
    {
        icon: "📦",
        title: "Monorepo Architecture",
        description: "Turborepo + pnpm workspaces. Shared UI, auth, and database packages across all microapps.",
    },
    {
        icon: "🎯",
        title: "Server Actions",
        description: "Each tool uses Next.js Server Actions for clean, type-safe AI generation without API routes.",
    },
    {
        icon: "🚀",
        title: "Ship in Minutes",
        description: "Clone, install, seed, and run. Your first microapp is live before your coffee gets cold.",
    },
];

export default function Home() {
    // Pick 8 featured tools (hand-picked variety across categories)
    const featuredSlugs = ["resume", "cold-email", "tweet-thread", "prd2jira", "ad-copy", "code-explain", "blog-outline", "elevator-pitch"];
    const featuredTools = featuredSlugs.map(s => TOOLS.find(t => t.slug === s)!).filter(Boolean);

    return (
        <div className="relative">
            {/* Gradient background orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] -z-10" />
            <div className="absolute top-40 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-[128px] -z-10" />

            {/* Hero */}
            <section className="container mx-auto px-4 md:px-6 pt-20 pb-16">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Open Source &nbsp;·&nbsp; Zero Paid SaaS &nbsp;·&nbsp; Ship Today
                    </div>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
                        Build AI Microapps{" "}
                        <span className="gradient-text">That Actually Ship</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
                        An open-source platform with 30+ single-purpose AI tools. No vendor lock-in.
                        No monthly fees. Clone it, customize it, ship it.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/tools"
                            className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all glow text-sm"
                        >
                            Explore 30+ Tools →
                        </Link>
                        <Link
                            href="/docs"
                            className="px-8 py-3 rounded-lg glass glass-hover font-semibold text-sm"
                        >
                            Read the Docs
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="glass rounded-xl p-6 text-center glow-sm">
                            <div className="text-3xl font-black gradient-text">{stat.value}</div>
                            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Tools */}
            <section className="container mx-auto px-4 md:px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        <span className="gradient-text">30+ AI Tools</span>, All Working
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Every tool works instantly — no signup, no API key required. Here are some of the most popular.
                    </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredTools.map((tool) => (
                        <Link
                            key={tool.slug}
                            href={`/tools/${tool.slug}`}
                            className="group glass rounded-2xl p-5 glass-hover block relative overflow-hidden"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />
                            <div className="relative">
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-lg shrink-0 shadow-lg`}>
                                        {tool.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm group-hover:text-white transition-colors truncate">
                                            {tool.name}
                                        </h3>
                                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                                            {tool.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                        <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Live</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground/60 group-hover:text-primary transition-colors">
                                        Try it →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Category chips */}
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {TOOL_CATEGORIES.map((cat) => {
                        const count = TOOLS.filter(t => t.category === cat.id).length;
                        return (
                            <Link
                                key={cat.id}
                                href={`/tools#${cat.id}`}
                                className="text-xs px-3 py-1.5 rounded-full glass glass-hover font-medium flex items-center gap-1.5"
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground">{count}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="text-center mt-8">
                    <Link
                        href="/tools"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all text-sm"
                    >
                        View All {TOOLS.length} Tools →
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="container mx-auto px-4 md:px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Everything you need, nothing you don&apos;t</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Built for developers who want to ship fast without signing up for 12 SaaS products.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((f) => (
                        <div key={f.title} className="glass rounded-xl p-6 glass-hover group">
                            <div className="text-3xl mb-4 group-hover:animate-float">{f.icon}</div>
                            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                            <p className="text-sm text-muted-foreground">{f.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="container mx-auto px-4 md:px-6 py-20">
                <div className="glass rounded-2xl p-12 text-center glow relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10" />
                    <div className="relative">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to build your microapp empire?</h2>
                        <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                            One command. Zero cost. Infinite potential.
                        </p>
                        <div className="glass rounded-lg p-4 max-w-md mx-auto mb-8 font-mono text-sm text-left">
                            <span className="text-green-400">$</span> git clone https://github.com/raj200501/MicroSaaS-Factory && cd MicroSaaS-Factory && pnpm install && pnpm dev
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <a
                                href="https://github.com/raj200501/MicroSaaS-Factory"
                                target="_blank"
                                rel="noopener"
                                className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all text-sm"
                            >
                                ⭐ Star on GitHub
                            </a>
                            <Link
                                href="/pricing"
                                className="px-8 py-3 rounded-lg glass glass-hover font-semibold text-sm"
                            >
                                View Pricing
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
