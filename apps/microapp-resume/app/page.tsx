"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button, Input, Textarea, Label, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@microsaas/ui";
import { generateResumeBullets } from "./actions";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Generating..." : "Generate Bullets"}
        </Button>
    );
}

export default function ResumeApp() {
    const [state, formAction] = useFormState(generateResumeBullets, null);

    return (
        <div className="grid gap-8 md:grid-cols-2 lg:max-w-6xl mx-auto w-full">
            <Card>
                <CardHeader>
                    <CardTitle>Bullet Generator</CardTitle>
                    <CardDescription>Enter details about your experience to generate polished resume bullets.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role Title</Label>
                            <Input id="role" name="role" placeholder="e.g. Senior Frontend Engineer" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company / Project</Label>
                            <Input id="company" name="company" placeholder="e.g. Acme Corp" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="responsibilities">Responsibilities & Outcomes</Label>
                            <Textarea
                                id="responsibilities"
                                name="responsibilities"
                                placeholder="Built the new dashboard, improved load times by 40%, led a team of 3..."
                                className="h-32"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="seniority">Seniority Level</Label>
                            <Input id="seniority" name="seniority" placeholder="e.g. Mid-level, Staff" />
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

            <div className="space-y-4">
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle>Generated Results</CardTitle>
                        <CardDescription>
                            Your optimized bullets will appear here.
                            {state?.provider && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">via {state.provider}</span>}
                            {state?.latencyMs && <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-800 text-xs rounded-full">{state.latencyMs}ms</span>}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-[300px]">
                        {!state?.result ? (
                            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                                Fill out the form to generate bullets.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Impact-Driven Bullets</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        {state.result.impactBullets.map((b: string, i: number) => <li key={i}>{b}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Concise Bullets</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        {state.result.conciseBullets.map((b: string, i: number) => <li key={i}>{b}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Technical Bullets</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        {state.result.technicalBullets.map((b: string, i: number) => <li key={i}>{b}</li>)}
                                    </ul>
                                </div>
                                <div className="bg-background border p-3 rounded text-sm italic">
                                    <strong>Why it works:</strong> {state.result.whyItWorks}
                                </div>
                                {/* Simulated PDF Export */}
                                <Button variant="outline" className="w-full" onClick={() => window.print()}>
                                    Export to PDF (Print)
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
