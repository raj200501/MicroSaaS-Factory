import { Button, Input, Textarea, Label, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@microsaas/ui";

export default function PRD2JiraApp() {
    return (
        <div className="grid gap-8 md:grid-cols-2 lg:max-w-6xl mx-auto w-full">
            <Card>
                <CardHeader>
                    <CardTitle>PRD Input</CardTitle>
                    <CardDescription>Paste your PRD and constraints to generate tickets.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={async (formData) => {
                        "use server";
                        const prd = formData.get("prd") as string;
                        const timeline = formData.get("timeline") as string;
                        const teamSize = formData.get("teamSize") as string;

                        console.log(`[PRD2Jira] Generating tickets for team size ${teamSize}`);
                    }} className="space-y-4">
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
                        <Button type="submit" className="w-full">Generate Tickets</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Generated Tickets</CardTitle>
                        <CardDescription>JSON formatted Jira tickets.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Download CSV</Button>
                        <Button variant="outline" size="sm" disabled>Copy Markdown</Button>
                    </div>
                </CardHeader>
                <CardContent className="flex items-center justify-center min-h-[300px] text-muted-foreground">
                    Fill out the form to generate tickets.
                    <br /><br />
                    (Local dev relies on the DummyProvider which returns a stubbed JSON response)
                </CardContent>
            </Card>
        </div>
    );
}
