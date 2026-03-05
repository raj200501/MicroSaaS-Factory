import { Button, Input, Textarea, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@microsaas/ui";
import { generateObject } from "@microsaas/llm";
import { z } from "zod";

const outputSchema = z.object({
    impactBullets: z.array(z.string()).describe("4 ATS-friendly bullets focused on measurable impact"),
    conciseBullets: z.array(z.string()).describe("4 concise bullets for executive summaries"),
    technicalBullets: z.array(z.string()).describe("4 bullets highlighting technical depth and stack"),
    whyItWorks: z.string().describe("A short note explaining why these bullets are effective"),
});

export default function ResumeApp() {
    return (
        <div className="grid gap-8 md:grid-cols-2 lg:max-w-6xl mx-auto w-full">
            <Card>
                <CardHeader>
                    <CardTitle>Bullet Generator</CardTitle>
                    <CardDescription>Enter details about your experience to generate polished resume bullets.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={async (formData) => {
                        "use server";
                        // Local stub: Normally we'd fetch the workspace config for the API key to use.
                        // Using the dummy provider by default for local dev.
                        const role = formData.get("role") as string;
                        const company = formData.get("company") as string;
                        const responsibilities = formData.get("responsibilities") as string;

                        console.log(`[Resume App] Generating bullets for ${role} at ${company}.`);

                        // In a real app we would call:
                        // const result = await generateObject({ ... })
                        // and return it or revalidate path.
                    }} className="space-y-4">
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
                        <Button type="submit" className="w-full">Generate Bullets</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle>Generated Results</CardTitle>
                    <CardDescription>Your optimized bullets will appear here.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center min-h-[300px] text-muted-foreground">
                    Fill out the form to generate bullets.
                    <br /><br />
                    (Local dev relies on the DummyProvider which returns a stubbed JSON response)
                </CardContent>
            </Card>
        </div>
    );
}
