import Link from "next/link";

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
        description: "Bring your own OpenAI or Anthropic key, or use the built-in DummyProvider for free local development.",
    },
    {
        icon: "🗄️",
        title: "Local SQLite Database",
        description: "No external database needed. Everything runs locally with Prisma + SQLite. Zero infrastructure costs.",
    },
    {
        icon: "🔐",
        title: "Built-in Auth & Sessions",
        description: "Cookie-based authentication with Edge middleware. Secure by default, zero third-party auth providers.",
    },
    {
        icon: "📦",
        title: "Monorepo Architecture",
        description: "Turborepo + pnpm workspaces. Shared UI, auth, and database packages across all microapps.",
    },
    {
        icon: "🎯",
        title: "Server Actions",
        description: "Each microapp uses Next.js Server Actions for clean, type-safe AI generation without API routes.",
    },
    {
        icon: "🚀",
        title: "Ship in Minutes",
        description: "Clone, install, seed, and run. Your first microapp is live before your coffee gets cold.",
    },
];

const realApps = [
    { name: "Resume Builder", slug: "resume", description: "Generate impact-driven resume bullets from your experience.", emoji: "📝" },
    { name: "PRD → Jira", slug: "prd2jira", description: "Convert product requirement docs into structured epics and tickets.", emoji: "📋" },
    { name: "Meeting Notes", slug: "meeting", description: "Extract action items and draft follow-up emails from meeting transcripts.", emoji: "🎙️" },
];

export default function Home() {
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
                            href="/showcase"
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

            {/* Real Apps */}
            <section className="container mx-auto px-4 md:px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">3 Fully Functional Microapps</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Real apps with real server actions, LLM integration, and export functionality.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {realApps.map((app) => (
                        <div key={app.slug} className="glass rounded-xl p-8 glass-hover group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="text-4xl mb-4">{app.emoji}</div>
                                <h3 className="font-bold text-xl mb-2">{app.name}</h3>
                                <p className="text-sm text-muted-foreground mb-6">{app.description}</p>
                                <div className="flex gap-2">
                                    <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-300 border border-green-500/30">Live</span>
                                    <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">Server Actions</span>
                                </div>
                            </div>
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
