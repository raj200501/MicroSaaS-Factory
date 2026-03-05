import { Metadata } from "next";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Launch Kit",
    description: "Ready-made launch content for Product Hunt, LinkedIn, X, and Indie Hackers.",
};

async function getLaunchFiles() {
    const launchDir = path.join(process.cwd(), "../../docs/launch");
    try {
        const files = await fs.readdir(launchDir);
        return files.filter((f) => f.endsWith(".md")).map((f) => ({
            name: f.replace(/_/g, " ").replace(".md", ""),
            filename: f,
        }));
    } catch {
        return [];
    }
}

export default async function LaunchKitPage() {
    const files = await getLaunchFiles();

    return (
        <div className="container mx-auto px-4 md:px-6 py-16 max-w-4xl">
            <div className="mb-12 animate-slide-up">
                <h1 className="text-4xl font-bold mb-4">
                    <span className="gradient-text">Launch Kit</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    Pre-generated launch content for Product Hunt, LinkedIn, X/Twitter, and more. All deterministic — no LLM calls needed.
                </p>
            </div>

            {/* Generator command */}
            <div className="glass rounded-xl p-6 mb-8">
                <h3 className="font-semibold mb-3 text-sm">Generate fresh content:</h3>
                <div className="font-mono text-sm bg-black/30 rounded-lg p-4">
                    <span className="text-green-400">$</span> pnpm generate:launch-kit
                </div>
            </div>

            {files.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {files.map((file) => (
                        <div key={file.filename} className="glass rounded-xl p-6 glass-hover">
                            <h3 className="font-semibold mb-2 capitalize">{file.name}</h3>
                            <p className="text-xs text-muted-foreground">docs/launch/{file.filename}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass rounded-xl p-12 text-center">
                    <p className="text-muted-foreground mb-4">
                        No launch content generated yet. Run the command above to create it.
                    </p>
                    <div className="font-mono text-xs bg-black/30 rounded-lg p-3 inline-block">
                        pnpm generate:launch-kit
                    </div>
                </div>
            )}
        </div>
    );
}
