import Link from "next/link";
import { TOOLS, TOOL_CATEGORIES } from "./_lib/tool-defs";

export const metadata = {
    title: "AI Tools",
    description: "30+ free AI-powered tools. No signup, no API key needed.",
};

export default function ToolsPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="gradient-text">30+ AI Tools</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Every tool works instantly — no signup, no API key needed. Powered by DummyProvider by default,
                    or add your own API key for real AI.
                </p>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
                {TOOL_CATEGORIES.map((cat) => (
                    <a
                        key={cat.id}
                        href={`#${cat.id}`}
                        className="text-sm px-4 py-2 rounded-full glass glass-hover font-medium"
                    >
                        {cat.icon} {cat.label}
                    </a>
                ))}
            </div>

            {/* Tools by category */}
            {TOOL_CATEGORIES.map((cat) => {
                const tools = TOOLS.filter((t) => t.category === cat.id);
                if (tools.length === 0) return null;
                return (
                    <section key={cat.id} id={cat.id} className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span>{cat.icon}</span> {cat.label}
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {tools.map((tool) => (
                                <Link
                                    key={tool.slug}
                                    href={`/tools/${tool.slug}`}
                                    className="group glass rounded-2xl p-6 glass-hover block"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-3xl">{tool.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold group-hover:text-white transition-colors truncate">
                                                {tool.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                {tool.description}
                                            </p>
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${tool.color} text-white font-medium`}>
                                                    Try it →
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {tool.inputs.length} input{tool.inputs.length > 1 ? "s" : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
