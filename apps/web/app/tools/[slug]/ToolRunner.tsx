"use client";

import { useState, useTransition, useRef } from "react";
import { runTool } from "../_lib/actions";

export default function ToolRunner({ tool }: { tool: any }) {
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [result, setResult] = useState<any>(null);
    const [isPending, startTransition] = useTransition();
    const [copied, setCopied] = useState(false);
    const outputRef = useRef<HTMLDivElement>(null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setResult(null);
        setCopied(false);
        startTransition(async () => {
            const res = await runTool(tool.slug, inputs);
            setResult(res);
            // Scroll to output on mobile
            setTimeout(() => {
                outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        });
    }

    function handleCopy() {
        if (result?.output) {
            navigator.clipboard.writeText(result.output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    function handleReset() {
        setInputs({});
        setResult(null);
        setCopied(false);
    }

    return (
        <div className="min-h-[80vh]">
            {/* Hero header with gradient */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />

                <div className="relative container mx-auto px-4 md:px-6 pt-8 pb-6">
                    <div className="flex items-start gap-4 mb-1">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl shadow-lg shadow-primary/20 shrink-0`}>
                            {tool.icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold px-2 py-0.5 rounded-full glass">
                                    {tool.category}
                                </span>
                                <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">
                                    ● Live
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{tool.name}</h1>
                            <p className="text-sm text-muted-foreground mt-1 max-w-lg">{tool.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 pb-12">
                <div className="grid gap-6 lg:grid-cols-5">
                    {/* ─── Input Panel (2 cols) ─── */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit}>
                            <div className="glass rounded-2xl overflow-hidden">
                                {/* Input header */}
                                <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Input</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">
                                        {tool.inputs.length} field{tool.inputs.length > 1 ? "s" : ""}
                                    </span>
                                </div>

                                {/* Input fields */}
                                <div className="p-5 space-y-4">
                                    {tool.inputs.map((input: any, idx: number) => (
                                        <div key={input.name} className="space-y-1.5">
                                            <label htmlFor={input.name} className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                                                {input.label}
                                            </label>
                                            {input.type === "textarea" ? (
                                                <textarea
                                                    id={input.name}
                                                    placeholder={input.placeholder || ""}
                                                    value={inputs[input.name] || ""}
                                                    onChange={(e) => setInputs((p) => ({ ...p, [input.name]: e.target.value }))}
                                                    rows={4}
                                                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 focus:bg-white/[0.05] transition-all duration-200 resize-none"
                                                />
                                            ) : (
                                                <input
                                                    id={input.name}
                                                    type="text"
                                                    placeholder={input.placeholder || ""}
                                                    value={inputs[input.name] || ""}
                                                    onChange={(e) => setInputs((p) => ({ ...p, [input.name]: e.target.value }))}
                                                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 focus:bg-white/[0.05] transition-all duration-200"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Submit */}
                                <div className="p-5 pt-0 space-y-2">
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden ${isPending
                                                ? "bg-white/5 text-muted-foreground cursor-not-allowed border border-white/5"
                                                : "bg-gradient-to-r " + tool.color + " text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99]"
                                            }`}
                                    >
                                        {isPending ? (
                                            <span className="flex items-center justify-center gap-2.5">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Generating...
                                            </span>
                                        ) : (
                                            <>✨ Generate {tool.outputDescription}</>
                                        )}
                                    </button>
                                    {result && (
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            ↺ Reset & try again
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Quick tips */}
                            <div className="mt-4 glass rounded-xl p-4">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">💡 Tips</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                    <li>• Be specific with your inputs for better results</li>
                                    <li>• Works instantly with no API key (DummyProvider)</li>
                                    <li>• Add API key in Studio for AI-powered output</li>
                                </ul>
                            </div>
                        </form>
                    </div>

                    {/* ─── Output Panel (3 cols) ─── */}
                    <div className="lg:col-span-3" ref={outputRef}>
                        <div className="glass rounded-2xl overflow-hidden min-h-[500px] flex flex-col">
                            {/* Output header */}
                            <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Output</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {result?.provider && (
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${result.provider === "BYOK"
                                                ? "bg-green-500/15 text-green-400 border border-green-500/20"
                                                : result.provider === "Demo (Shared Gemini)"
                                                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                                                    : "bg-white/5 text-muted-foreground border border-white/10"
                                            }`}>
                                            {result.provider}
                                        </span>
                                    )}
                                    {result?.cached && (
                                        <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 font-bold">
                                            CACHED
                                        </span>
                                    )}
                                    {result?.latencyMs != null && (
                                        <span className="text-[10px] text-muted-foreground font-mono">
                                            {result.latencyMs}ms
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Output body */}
                            <div className="flex-1 p-5">
                                {/* Empty state */}
                                {!result && !isPending && (
                                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                                        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-4xl mb-5 opacity-20`}>
                                            {tool.icon}
                                        </div>
                                        <p className="text-muted-foreground text-sm font-medium">
                                            Your generated output will appear here
                                        </p>
                                        <p className="text-muted-foreground/50 text-xs mt-1">
                                            Fill in the inputs and click Generate
                                        </p>
                                    </div>
                                )}

                                {/* Loading state */}
                                {isPending && (
                                    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                                        <div className="relative mb-6">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-3xl animate-pulse`}>
                                                {tool.icon}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                                                <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 mb-3">
                                            {[0, 1, 2].map(i => (
                                                <div
                                                    key={i}
                                                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${tool.color} animate-bounce`}
                                                    style={{ animationDelay: `${i * 150}ms` }}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Generating {tool.outputDescription}...</p>
                                    </div>
                                )}

                                {/* Error state */}
                                {result?.error && (
                                    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                                        <div className="w-full max-w-md rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-center">
                                            <div className="text-3xl mb-3">{result.rateLimited ? "⏱️" : "❌"}</div>
                                            <p className="text-sm text-red-300 font-medium mb-2">{result.error}</p>
                                            {result.rateLimited && (
                                                <p className="text-xs text-red-400/60">
                                                    Add your own API key in Studio → LLM Keys for unlimited access.
                                                </p>
                                            )}
                                            <button
                                                onClick={handleReset}
                                                className="mt-4 text-xs px-4 py-2 rounded-lg glass glass-hover font-medium"
                                            >
                                                Try again
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Success state */}
                                {result?.output && (
                                    <div className="space-y-4">
                                        {/* Output content */}
                                        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-5">
                                            <pre className="whitespace-pre-wrap text-sm leading-7 text-foreground/90 font-sans break-words">
                                                {result.output}
                                            </pre>
                                        </div>

                                        {/* Action bar */}
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={handleCopy}
                                                className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${copied
                                                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                                        : "glass glass-hover"
                                                    }`}
                                            >
                                                {copied ? "✓ Copied!" : "📋 Copy to clipboard"}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const blob = new Blob([result.output], { type: "text/plain" });
                                                    const url = URL.createObjectURL(blob);
                                                    const a = document.createElement("a");
                                                    a.href = url;
                                                    a.download = `${tool.slug}-output.txt`;
                                                    a.click();
                                                    URL.revokeObjectURL(url);
                                                }}
                                                className="text-xs px-4 py-2 rounded-lg glass glass-hover font-semibold"
                                            >
                                                💾 Download .txt
                                            </button>
                                            <button
                                                onClick={handleReset}
                                                className="text-xs px-4 py-2 rounded-lg glass glass-hover font-semibold"
                                            >
                                                ↺ Generate another
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
