"use client";

import { useState, useTransition } from "react";
import { runTool } from "../_lib/actions";

export default function ToolRunner({ tool }: { tool: any }) {
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [result, setResult] = useState<any>(null);
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setResult(null);
        startTransition(async () => {
            const res = await runTool(tool.slug, inputs);
            setResult(res);
        });
    }

    return (
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
            {/* Tool Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{tool.icon}</span>
                    <div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                            {tool.category}
                        </span>
                        <h1 className="text-3xl font-bold">{tool.name}</h1>
                    </div>
                </div>
                <p className="text-muted-foreground mt-2">{tool.description}</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Input Panel */}
                <div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="glass rounded-2xl p-6 space-y-5">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <span className="text-sm">📝</span> Input
                            </h2>
                            {tool.inputs.map((input: any) => (
                                <div key={input.name} className="space-y-2">
                                    <label
                                        htmlFor={input.name}
                                        className="text-sm font-medium text-foreground"
                                    >
                                        {input.label}
                                    </label>
                                    {input.type === "textarea" ? (
                                        <textarea
                                            id={input.name}
                                            placeholder={input.placeholder || ""}
                                            value={inputs[input.name] || ""}
                                            onChange={(e) =>
                                                setInputs((p) => ({ ...p, [input.name]: e.target.value }))
                                            }
                                            rows={5}
                                            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                                        />
                                    ) : (
                                        <input
                                            id={input.name}
                                            type="text"
                                            placeholder={input.placeholder || ""}
                                            value={inputs[input.name] || ""}
                                            onChange={(e) =>
                                                setInputs((p) => ({ ...p, [input.name]: e.target.value }))
                                            }
                                            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${isPending
                                    ? "bg-white/10 text-muted-foreground cursor-not-allowed"
                                    : "bg-gradient-to-r " + tool.color + " text-white hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
                                }`}
                        >
                            {isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Generating...
                                </span>
                            ) : (
                                `Generate ${tool.outputDescription} →`
                            )}
                        </button>
                    </form>
                </div>

                {/* Output Panel */}
                <div>
                    <div className="glass rounded-2xl p-6 min-h-[300px]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <span className="text-sm">✨</span> Output
                            </h2>
                            {result?.provider && (
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${result.provider === "BYOK"
                                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                        : result.provider === "Demo (Shared Gemini)"
                                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                            : "bg-white/10 text-muted-foreground border border-white/10"
                                    }`}>
                                    {result.provider}
                                    {result.cached && " · Cached"}
                                    {result.latencyMs && ` · ${result.latencyMs}ms`}
                                </span>
                            )}
                        </div>

                        {!result && !isPending && (
                            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                                <p className="text-center">
                                    Fill in the inputs and click Generate<br />
                                    <span className="text-xs opacity-60">Works without any API keys (DummyProvider)</span>
                                </p>
                            </div>
                        )}

                        {isPending && (
                            <div className="flex items-center justify-center h-48">
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-1.5 mb-2">
                                        {[0, 1, 2].map(i => (
                                            <div
                                                key={i}
                                                className="w-2 h-2 rounded-full bg-primary animate-bounce"
                                                style={{ animationDelay: `${i * 150}ms` }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground">Generating output...</p>
                                </div>
                            </div>
                        )}

                        {result?.error && (
                            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                                <p className="text-sm text-red-300 font-medium">
                                    {result.rateLimited ? "⏱️ " : "❌ "}
                                    {result.error}
                                </p>
                                {result.rateLimited && (
                                    <p className="text-xs text-red-400/70 mt-2">
                                        Add your own API key in Studio → LLM Keys for unlimited access.
                                    </p>
                                )}
                            </div>
                        )}

                        {result?.output && (
                            <div className="space-y-3">
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 bg-transparent p-0 m-0 font-sans">
                                        {result.output}
                                    </pre>
                                </div>
                                <div className="flex gap-2 pt-3 border-t border-white/5">
                                    <button
                                        onClick={() => navigator.clipboard.writeText(result.output)}
                                        className="text-xs px-3 py-1.5 rounded-lg glass glass-hover font-medium"
                                    >
                                        📋 Copy
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
