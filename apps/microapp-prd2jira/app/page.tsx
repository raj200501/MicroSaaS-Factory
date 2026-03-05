"use client";

import { useFormState, useFormStatus } from "react-dom";
import { generateTickets } from "./actions";
import { useState } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${pending ? "bg-white/5 text-muted-foreground cursor-not-allowed border border-white/5"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                }`}>
            {pending ? (
                <span className="flex items-center justify-center gap-2.5">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Generating tickets...
                </span>
            ) : "✨ Generate Epics & Tickets"}
        </button>
    );
}

function TicketCard({ ticket, epicColor }: { ticket: any; epicColor: string }) {
    return (
        <div className="glass rounded-xl p-4 glass-hover">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm flex-1 mr-2">{ticket.title}</h4>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold bg-gradient-to-r ${epicColor} text-white`}>
                    {ticket.storyPoints} pts
                </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{ticket.description}</p>
            <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Acceptance Criteria</span>
                <ul className="space-y-1">
                    {ticket.acceptanceCriteria.map((ac: string, k: number) => (
                        <li key={k} className="flex gap-2 text-xs text-foreground/80">
                            <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                            <span>{ac}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default function PRD2JiraApp() {
    const [state, formAction] = useFormState(generateTickets, null);
    const [copied, setCopied] = useState(false);

    const epicColors = ["from-blue-500 to-indigo-500", "from-purple-500 to-pink-500", "from-teal-500 to-cyan-500", "from-orange-500 to-red-500"];

    const handleDownloadCSV = () => {
        if (!state?.result) return;
        let csv = "Epic,Ticket Title,Description,Story Points\n";
        state.result.epics.forEach((epic: any) => {
            epic.tickets.forEach((t: any) => {
                csv += `"${epic.title}","${t.title}","${t.description.replace(/"/g, '""')}",${t.storyPoints}\n`;
            });
        });
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "tickets.csv"; a.click();
        URL.revokeObjectURL(url);
    };

    const handleCopyMarkdown = () => {
        if (!state?.result) return;
        let md = "# Jira Tickets\n\n";
        state.result.epics.forEach((epic: any) => {
            md += `## Epic: ${epic.title}\n_${epic.summary}_\n\n`;
            epic.tickets.forEach((t: any) => {
                md += `### [${t.storyPoints} pts] ${t.title}\n${t.description}\n\n**Acceptance Criteria:**\n`;
                t.acceptanceCriteria.forEach((ac: string) => { md += `- ${ac}\n`; });
                md += "\n---\n\n";
            });
        });
        navigator.clipboard.writeText(md);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl">
            <div className="mb-8 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">🎫</div>
                <div>
                    <h1 className="text-2xl font-bold">PRD → Tickets</h1>
                    <p className="text-sm text-muted-foreground">Convert PRDs into structured Agile epics and tickets</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* Input (2 cols) */}
                <div className="lg:col-span-2">
                    <form action={formAction}>
                        <div className="glass rounded-2xl overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-white/5 flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Input</span>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="timeline" className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">Timeline</label>
                                    <input id="timeline" name="timeline" type="text" placeholder="e.g. 6 weeks"
                                        className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="teamSize" className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">Team Size</label>
                                    <input id="teamSize" name="teamSize" type="text" placeholder="e.g. 4 engineers"
                                        className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="prd" className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">Product Requirement Document</label>
                                    <textarea id="prd" name="prd" rows={8} required
                                        placeholder="Paste the PRD text here..."
                                        className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none" />
                                </div>
                            </div>
                            <div className="p-5 pt-0"><SubmitButton /></div>
                        </div>
                    </form>
                    {state?.error && (
                        <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                            <p className="text-sm text-red-300">❌ {state.error}</p>
                        </div>
                    )}
                </div>

                {/* Output (3 cols) */}
                <div className="lg:col-span-3 space-y-4">
                    {state?.provider && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${state.provider === "BYOK" ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-white/5 text-muted-foreground border border-white/10"
                                    }`}>{state.provider}</span>
                                {state.latencyMs && <span className="text-[10px] text-muted-foreground font-mono">{state.latencyMs}ms</span>}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleDownloadCSV} disabled={!state?.result} className="text-xs px-3 py-1.5 rounded-lg glass glass-hover font-semibold disabled:opacity-30">📥 CSV</button>
                                <button onClick={handleCopyMarkdown} disabled={!state?.result} className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${copied ? "bg-green-500/20 text-green-300" : "glass glass-hover"}`}>
                                    {copied ? "✓ Copied" : "📋 Markdown"}
                                </button>
                            </div>
                        </div>
                    )}

                    {!state?.result ? (
                        <div className="glass rounded-2xl flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-4xl mb-5 opacity-40">🎫</div>
                            <p className="text-muted-foreground text-sm font-medium">Your generated tickets will appear here</p>
                            <p className="text-muted-foreground/50 text-xs mt-1">Paste a PRD and click Generate</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {state.result.epics.map((epic: any, i: number) => (
                                <div key={i}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${epicColors[i % epicColors.length]} flex items-center justify-center text-xs font-bold text-white`}>
                                            E{i + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm">{epic.title}</h3>
                                            <p className="text-[11px] text-muted-foreground">{epic.summary}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 ml-11">
                                        {epic.tickets.map((t: any, j: number) => (
                                            <TicketCard key={j} ticket={t} epicColor={epicColors[i % epicColors.length]} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {/* Total points */}
                            <div className="glass rounded-xl p-4 flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Story Points</span>
                                <span className="text-lg font-bold gradient-text">
                                    {state.result.epics.reduce((sum: number, e: any) => sum + e.tickets.reduce((s: number, t: any) => s + t.storyPoints, 0), 0)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
