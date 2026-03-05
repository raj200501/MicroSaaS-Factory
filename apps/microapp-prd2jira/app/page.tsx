"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button, Input, Textarea, Label, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@microsaas/ui";
import { generateTickets } from "./actions";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Generating..." : "Generate Tickets"}
        </Button>
    );
}

export default function PRD2JiraApp() {
    const [state, formAction] = useFormState(generateTickets, null);

    const handleDownloadCSV = () => {
        if (!state?.result) return;
        const epics = state.result.epics;
        let csv = "Epic,Ticket Title,Description,Story Points\n";
        epics.forEach((epic: any) => {
            epic.tickets.forEach((t: any) => {
                const descPreview = t.description.replace(/"/g, '""');
                csv += `"${epic.title}","${t.title}","${descPreview}",${t.storyPoints}\n`;
            });
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tickets.csv';
        a.click();
    };

    const handleCopyMarkdown = () => {
        if (!state?.result) return;
        const epics = state.result.epics;
        let md = "# Jira Tickets\n\n";
        epics.forEach((epic: any) => {
            md += `## Epic: ${epic.title}\n_${epic.summary}_\n\n`;
            epic.tickets.forEach((t: any) => {
                md += `### [${t.storyPoints} pts] ${t.title}\n`;
                md += `${t.description}\n\n**Acceptance Criteria:**\n`;
                t.acceptanceCriteria.forEach((ac: string) => {
                    md += `- ${ac}\n`;
                });
                md += `\n---\n\n`;
            });
        });
        navigator.clipboard.writeText(md);
        alert("Copied to clipboard!");
    };

    return (
        <div className="grid gap-8 md:grid-cols-2 lg:max-w-6xl mx-auto w-full">
            <Card>
                <CardHeader>
                    <CardTitle>PRD Input</CardTitle>
                    <CardDescription>Paste your PRD and constraints to generate tickets.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="timeline">Timeline Constraints (Optional)</Label>
                            <Input id="timeline" name="timeline" placeholder="e.g. 2 weeks, ASAP" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="teamSize">Team Size (Optional)</Label>
                            <Input id="teamSize" name="teamSize" placeholder="e.g. 2 FrontEnd, 1 BackEnd" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="prd">Product Requirement Document</Label>
                            <Textarea
                                id="prd"
                                name="prd"
                                placeholder="Paste the PRD text here..."
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
                        <CardTitle>Generated Tickets</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1 mb-0">
                            Jira tickets mapped to Epics.
                            {state?.provider && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">via {state.provider}</span>}
                            {state?.latencyMs && <span className="px-2 py-0.5 bg-gray-200 text-gray-800 text-xs rounded-full">{state.latencyMs}ms</span>}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled={!state?.result} onClick={handleDownloadCSV}>CSV</Button>
                        <Button variant="outline" size="sm" disabled={!state?.result} onClick={handleCopyMarkdown}>Markdown</Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                    {!state?.result ? (
                        <div className="flex h-full items-center justify-center text-muted-foreground text-sm min-h-[300px]">
                            Fill out the form to generate tickets.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {state.result.epics.map((epic: any, i: number) => (
                                <div key={i} className="space-y-4 pb-4 border-b last:border-0">
                                    <div>
                                        <h3 className="font-semibold text-lg text-primary">{epic.title}</h3>
                                        <p className="text-sm text-muted-foreground">{epic.summary}</p>
                                    </div>
                                    <div className="space-y-3">
                                        {epic.tickets.map((t: any, j: number) => (
                                            <div key={j} className="bg-background border rounded-lg p-4 shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-medium text-sm flex-1 mr-2">{t.title}</h4>
                                                    <span className="bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded">
                                                        {t.storyPoints} pts
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-3">{t.description}</p>
                                                <div>
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acceptance Criteria</span>
                                                    <ul className="list-disc pl-4 mt-1 space-y-1 text-xs">
                                                        {t.acceptanceCriteria.map((ac: string, k: number) => (
                                                            <li key={k}>{ac}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
