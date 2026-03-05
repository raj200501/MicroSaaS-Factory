import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@microsaas/ui";

export default async function DocsIndexPage() {
    const docsDir = path.join(process.cwd(), "../../docs");
    const files = await fs.readdir(docsDir);
    const mdFiles = files.filter(f => f.endsWith(".md"));

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Documentation</h1>
            <div className="grid gap-4 md:grid-cols-2">
                {mdFiles.map(file => {
                    const slug = file.replace(".md", "");
                    return (
                        <Link href={`/docs/${slug}`} key={slug}>
                            <Card className="h-full hover:bg-muted/50 transition-colors">
                                <CardHeader>
                                    <CardTitle className="capitalize">{slug.replace(/_/g, " ")}</CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
