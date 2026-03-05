"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { Button, Textarea, Label, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@microsaas/ui";
import { extractMeetingActions, handleSendFollowUp } from "./actions";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Extracting..." : "Extract Action Items"}
        </Button>
    );
}

export default function MeetingApp() {
    const [state, formAction] = useFormState(extractMeetingActions, null);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const onSendEmail = async () => {
        if (!state?.result || !state?.userEmail) return;
        setSending(true);
        try {
            await handleSendFollowUp("team@example.com", state.userEmail, state.result.emailDraft);
            setSent(true);
            alert("Follow up captured locally! Check the Studio app Messages tab.");
        } catch (e) {
            alert("Failed to send email");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="grid gap-8 md:grid-cols-2 lg:max-w-6xl mx-auto w-full">
            <Card>
                <CardHeader>
                    <CardTitle>Meeting Notes Input</CardTitle>
                    <CardDescription>Paste your raw meeting notes to extract action items.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="notes">Raw Meeting Notes</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                placeholder="Paste the meeting notes here... (transcript or rough notes)"
                                className="h-64"
                                required
                            />
                        </div>
                        <SubmitButton />
                    </form>
                    {state?.error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-800 rounded text-sm">
                            {state.error}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-muted/50 flex flex-col h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Extracted Actions & Draft</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1 mb-0">
                            Action items and a follow-up email draft.
                            {state?.provider && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">via {state.provider}</span>}
                            {state?.latencyMs && <span className="px-2 py-0.5 bg-gray-200 text-gray-800 text-xs rounded-full">{state.latencyMs}ms</span>}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!state?.result || sending || sent}
                            onClick={onSendEmail}
                        >
                            {sending ? "Sending..." : sent ? "Sent!" : "Send Follow-up"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                    {!state?.result ? (
                        <div className="flex h-full items-center justify-center text-muted-foreground text-sm min-h-[300px]">
                            Fill out the form to extract actions.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-3">Action Items</h3>
                                <div className="space-y-2">
                                    {state.result.actionItems.map((item: any, i: number) => (
                                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-background p-3 rounded-lg border text-sm">
                                            <div>
                                                <span className="font-semibold text-primary">{item.assignee}</span>: {item.task}
                                            </div>
                                            <div className="mt-2 sm:mt-0 text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded w-fit">
                                                {item.deadline}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-2">Email Draft</h3>
                                <div className="bg-background border p-4 rounded-lg text-sm whitespace-pre-wrap font-sans">
                                    {state.result.emailDraft}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
