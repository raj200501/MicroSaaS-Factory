import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Documentation",
    description: "MicroSaaS Factory documentation — quickstart, architecture, security, and more.",
};

async function getDocFiles() {
    const docsDir = path.join(process.cwd(), "../../docs");
    try {
        const files = await fs.readdir(docsDir);
        return files
            .filter((f) => f.endsWith(".md"))
            .map((f) => ({
                slug: f.replace(".md", "").toLowerCase(),
                title: f.replace(".md", "").replace(/_/g, " "),
                filename: f,
            }));
    } catch {
        return [];
    }
}

export default async function DocsPage() {
    const docs = await getDocFiles();

    return (
        <div className="container mx-auto px-4 md:px-6 py-16 max-w-5xl">
            <div className="mb-12 animate-slide-up">
                <h1 className="text-4xl font-bold mb-4">
                    <span className="gradient-text">Documentation</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    Everything you need to get started, deploy, and extend MicroSaaS Factory.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {docs.map((doc) => (
                    <Link
                        key={doc.slug}
                        href={`/docs/${doc.slug}`}
                        className="glass rounded-xl p-6 glass-hover group block"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">📄</span>
                            <div>
                                <h3 className="font-semibold group-hover:text-white transition-colors capitalize">{doc.title}</h3>
                                <p className="text-xs text-muted-foreground">docs/{doc.filename}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick links */}
            <div className="mt-12 glass rounded-xl p-8">
                <h2 className="text-xl font-bold mb-4">Quick Start</h2>
                <div className="space-y-3 font-mono text-sm">
                    <div className="bg-black/30 rounded-lg p-3">
                        <span className="text-green-400">$</span> git clone https://github.com/raj200501/MicroSaaS-Factory
                    </div>
                    <div className="bg-black/30 rounded-lg p-3">
                        <span className="text-green-400">$</span> cd MicroSaaS-Factory && pnpm install
                    </div>
                    <div className="bg-black/30 rounded-lg p-3">
                        <span className="text-green-400">$</span> pnpm db:push && pnpm db:seed
                    </div>
                    <div className="bg-black/30 rounded-lg p-3">
                        <span className="text-green-400">$</span> pnpm dev
                    </div>
                </div>
            </div>
        </div>
    );
}
