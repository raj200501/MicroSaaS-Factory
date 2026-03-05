"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { extractMeetingActions, handleSendFollowUp } from "./actions";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${pending ? "bg-white/5 text-muted-foreground cursor-not-allowed border border-white/5"
                    : "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                }`}>
            {pending ? (
                <span className="flex items-center justify-center gap-2.5">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Extracting actions...
                </span>
            ) : "✨ Extract Action Items"}
        </button>
    );
}

export default function MeetingApp() {
    const [state, formAction] = useFormState(extractMeetingActions, null);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [emailCopied, setEmailCopied] = useState(false);

    const onSendEmail = async () => {
        if (!state?.result || !state?.userEmail) return;
        setSending(true);
        try {
            await handleSendFollowUp("team@example.com", state.userEmail, state.result.emailDraft);
            setSent(true);
        } catch (e) {
            // Error handled silently — logged in Studio
        } finally {
            setSending(false);
        }
    };

    const statusColors: Record<string, string> = {
        ASAP: "from-red-500 to-orange-500",
        "This week": "from-amber-500 to-yellow-500",
        "Next week": "from-blue-500 to-cyan-500",
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl">
            <div className="mb-8 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-teal-500/20">📋</div>
                <div>
                    <h1 className="text-2xl font-bold">Meeting Notes → Actions</h1>
                    <p className="text-sm text-muted-foreground">Extract action items and draft follow-up emails</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* Input (2 cols) */}
                <div className="lg:col-span-2">
                    <form action={formAction}>
                        <div className="glass rounded-2xl overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-white/5 flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meeting Notes</span>
                            </div>
                            <div className="p-5">
                                <textarea id="notes" name="notes" rows={12} required
                                    placeholder="Paste your meeting notes, transcript, or rough notes here...

Example:
- John to finalize design by Friday
- Sarah will set up the staging environment
- Need to review the API spec before next week's sprint
- Budget approval needed from Mike by EOD Tuesday"
                                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none" />
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
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${state.provider === "BYOK" ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-white/5 text-muted-foreground border border-white/10"
                                }`}>{state.provider}</span>
                            {state.latencyMs && <span className="text-[10px] text-muted-foreground font-mono">{state.latencyMs}ms</span>}
                        </div>
                    )}

                    {!state?.result ? (
                        <div className="glass rounded-2xl flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center text-4xl mb-5 opacity-40">📋</div>
                            <p className="text-muted-foreground text-sm font-medium">Action items will appear here</p>
                            <p className="text-muted-foreground/50 text-xs mt-1">Paste your meeting notes and click Extract</p>
                        </div>
                    ) : (
                        <>
                            {/* Action Items */}
                            <div className="glass rounded-2xl overflow-hidden">
                                <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span>🎯</span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Action Items ({state.result.actionItems.length})
                                        </span>
                                    </div>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {state.result.actionItems.map((item: any, i: number) => {
                                        const deadlineColor = statusColors[item.deadline] || "from-gray-500 to-slate-500";
                                        return (
                                            <div key={i} className="p-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
                                                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
                                                    {i + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold text-primary">{item.assignee}</span>
                                                        <span className={`text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r ${deadlineColor} text-white font-bold`}>
                                                            {item.deadline}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-foreground/80">{item.task}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Email Draft */}
                            <div className="glass rounded-2xl overflow-hidden">
                                <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span>✉️</span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Follow-up Email Draft</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => { navigator.clipboard.writeText(state.result.emailDraft); setEmailCopied(true); setTimeout(() => setEmailCopied(false), 1500); }}
                                            className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition-all ${emailCopied ? "bg-green-500/20 text-green-300" : "glass glass-hover"}`}>
                                            {emailCopied ? "✓ Copied" : "📋 Copy"}
                                        </button>
                                        <button onClick={onSendEmail} disabled={sending || sent}
                                            className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition-all ${sent ? "bg-green-500/20 text-green-300 border border-green-500/20"
                                                    : sending ? "bg-white/5 text-muted-foreground"
                                                        : "bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25"
                                                }`}>
                                            {sending ? "Sending..." : sent ? "✓ Sent" : "📤 Send"}
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <pre className="whitespace-pre-wrap text-sm leading-7 text-foreground/80 font-sans">
                                        {state.result.emailDraft}
                                    </pre>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
