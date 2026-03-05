import fs from "fs-extra";
import path from "path";

const appsJsonPath = path.resolve(__dirname, "../../../docs/microapps-30.json");
const appsBaseDir = path.resolve(__dirname, "../../app/showcase");

async function run() {
    const apps = await fs.readJson(appsJsonPath);

    for (const app of apps) {
        const appDir = path.join(appsBaseDir, app.slug);
        await fs.ensureDir(appDir);

        const inputsHtml = app.inputs.map((input: any) => {
            if (input.type === "textarea") {
                return `
            <div className="space-y-2">
              <Label htmlFor="${input.name}">${input.label}</Label>
              <Textarea id="${input.name}" name="${input.name}" required />
            </div>`;
            }
            return `
            <div className="space-y-2">
              <Label htmlFor="${input.name}">${input.label}</Label>
              <Input id="${input.name}" name="${input.name}" required />
            </div>`;
        }).join("");

        const pageContent = `import { Button, Input, Textarea, Label, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@microsaas/ui";
import { generateObject } from "@microsaas/llm";
import { z } from "zod";

export default function MicroappStub() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:max-w-6xl mx-auto w-full p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>${app.name}</CardTitle>
          <CardDescription>${app.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={async (formData) => {
            "use server";
            // Local stub logic: Deterministic DummyProvider output
            console.log("Generating ${app.slug} output...");
          }} className="space-y-4">
${inputsHtml}
            <Button type="submit" className="w-full">Generate</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Result</CardTitle>
          <CardDescription>Expect: ${app.outputDescription}</CardDescription>
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
`;
        await fs.writeFile(path.join(appDir, "page.tsx"), pageContent);
    }

    console.log(`Generated 30 stubs in apps/web/app/showcase successfully!`);
}

run().catch(console.error);
