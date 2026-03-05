import { Button, Input, Textarea, Label, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@microsaas/ui";
import { generateObject } from "@microsaas/llm";
import { z } from "zod";

export default function MicroappStub() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:max-w-6xl mx-auto w-full p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Press Release Draft</CardTitle>
          <CardDescription>Draft a standard press release.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={async (formData) => {
            "use server";
            // Local stub logic: Deterministic DummyProvider output
            console.log("Generating press-release output...");
          }} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="announcement">The Announcement</Label>
              <Textarea id="announcement" name="announcement" required />
            </div>
            <Button type="submit" className="w-full">Generate</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Result</CardTitle>
          <CardDescription>Expect: A formatted press release</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[300px] text-muted-foreground">
          Fill out the form to generate.
          <br /><br />
          (STUB: Local dev relies on deterministic model output)
        </CardContent>
      </Card>
    </div>
  );
}
