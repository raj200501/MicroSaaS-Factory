import Link from "next/link";
import { TOOLS, TOOL_CATEGORIES } from "./_lib/tool-defs";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Tools — 30+ Free AI-Powered Tools",
    description: "30+ free AI-powered tools. No signup, no API key needed. Generate resume bullets, ad copy, cold emails, SQL queries, and more.",
};

export default function ToolsPage() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
                <div className="absolute top-20 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute top-40 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />

                <div className="relative container mx-auto px-4 md:px-6 pt-16 pb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-semibold text-muted-foreground mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        {TOOLS.length} tools — all free, all working
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                        <span className="gradient-text">AI-Powered Tools</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Every tool works instantly — no signup, no API key needed.
                        Powered by DummyProvider by default, or bring your own key for real AI.
                    </p>

                    {/* Category nav */}
                    <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                        {TOOL_CATEGORIES.map((cat) => {
                            const count = TOOLS.filter(t => t.category === cat.id).length;
                            return (
                                <a
                                    key={cat.id}
                                    href={`#${cat.id}`}
                                    className="group text-sm px-4 py-2 rounded-full glass glass-hover font-medium flex items-center gap-2 transition-all"
                                >
                                    <span>{cat.icon}</span>
                                    <span>{cat.label}</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground group-hover:text-foreground transition-colors">
                                        {count}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tools by category */}
            <div className="container mx-auto px-4 md:px-6 pb-20">
                {TOOL_CATEGORIES.map((cat) => {
                    const tools = TOOLS.filter((t) => t.category === cat.id);
                    if (tools.length === 0) return null;
                    return (
                        <section key={cat.id} id={cat.id} className="mb-16 scroll-mt-20">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-xl">
                                    {cat.icon}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{cat.label}</h2>
                                    <p className="text-xs text-muted-foreground">{tools.length} tools</p>
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {tools.map((tool) => (
                                    <Link
                                        key={tool.slug}
                                        href={`/tools/${tool.slug}`}
                                        className="group glass rounded-2xl p-5 glass-hover block relative overflow-hidden"
                                    >
                                        {/* Gradient hover glow */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

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
                                                    {tool.inputs.length} input{tool.inputs.length > 1 ? "s" : ""} →
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
