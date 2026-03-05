import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import { marked } from "marked";
import Link from "next/link";
import { Button } from "@microsaas/ui";

export default async function DocPage({ params }: { params: { slug: string } }) {
    const docsDir = path.join(process.cwd(), "../../docs");
    const filePath = path.join(docsDir, `${params.slug}.md`);

    let content = "";
    try {
        content = await fs.readFile(filePath, "utf8");
    } catch (e) {
        notFound();
    }

    const html = marked(content);

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 max-w-3xl">
            <Button variant="ghost" asChild className="mb-8">
                <Link href="/docs">← Back to Docs</Link>
            </Button>
            <div
                className="prose prose-stone dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}
