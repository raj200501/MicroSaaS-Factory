import { Button, Textarea, Label, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@microsaas/ui";

export default function MeetingApp() {
    return (
        <div className="grid gap-8 md:grid-cols-2 lg:max-w-6xl mx-auto w-full">
            <Card>
                <CardHeader>
                    <CardTitle>Meeting Notes Input</CardTitle>
                    <CardDescription>Paste your raw meeting notes to extract action items.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={async (formData) => {
                        "use server";
                        const notes = formData.get("notes") as string;

                        console.log(`[Meeting App] Extracting actions from notes of length ${notes.length}`);
                    }} className="space-y-4">
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
                        <Button type="submit" className="w-full">Extract Action Items</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Extracted Actions & Draft</CardTitle>
                        <CardDescription>Action items and a follow-up email draft.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Send Follow-up</Button>
                    </div>
                </CardHeader>
                <CardContent className="flex items-center justify-center min-h-[300px] text-muted-foreground">
                    Fill out the form to extract actions.
                    <br /><br />
                    (Local dev relies on the DummyProvider which returns a stubbed JSON response)
                </CardContent>
            </Card>
        </div>
    );
}
