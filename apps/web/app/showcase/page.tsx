import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "@microsaas/ui";
import Link from "next/link";
import fs from "fs/promises";
import path from "path";

export default async function ShowcasePage() {
    const jsonPath = path.join(process.cwd(), "../../docs/microapps-30.json");
    const fileContents = await fs.readFile(jsonPath, "utf8");
    const apps = JSON.parse(fileContents);

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 max-w-7xl">
            <div className="mb-12">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Microapp Showcase</h1>
                <p className="mt-4 text-xl text-muted-foreground">
                    Explore our collection of 30+ single-purpose, highly focused AI microapps.
                </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {apps.map((app: any) => (
                    <Card key={app.slug} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{app.name}</CardTitle>
                            <CardDescription>{app.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto flex justify-end">
                            <Button asChild size="sm" variant="outline">
                                <Link href={`/showcase/${app.slug}`}>Open App</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
