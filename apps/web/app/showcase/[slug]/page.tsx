import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type MicroApp = {
    name: string;
    slug: string;
    description: string;
    inputs: Array<{ name: string; label: string; type: string }>;
    outputDescription: string;
};

const realApps: Record<string, { port: number }> = {
    resume: { port: 3002 },
    "prd2jira": { port: 3003 },
    meeting: { port: 3004 },
};

async function getApps(): Promise<MicroApp[]> {
    const jsonPath = path.join(process.cwd(), "../../docs/microapps-30.json");
    const data = await fs.readFile(jsonPath, "utf8");
    return JSON.parse(data);
}

export async function generateStaticParams() {
    const apps = await getApps();
    const realSlugs = ["resume", "prd2jira", "meeting"];
    const allSlugs = [...realSlugs, ...apps.map((a) => a.slug)];
    return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const apps = await getApps();
    const app = apps.find((a) => a.slug === params.slug);
    const name = app?.name || params.slug;
    return {
        title: `${name} — AI Microapp`,
        description: app?.description || `Try the ${name} microapp powered by MicroSaaS Factory.`,
        openGraph: {
            title: `${name} | MicroSaaS Factory`,
            description: app?.description || `AI-powered ${name}. Zero setup.`,
            images: [{ url: `/api/og?title=${encodeURIComponent(name)}`, width: 1200, height: 630 }],
        },
    };
}

export default async function MicroappDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const apps = await getApps();
    const app = apps.find((a) => a.slug === slug);
    const isReal = slug in realApps;

    // For real apps without a stub definition, use hardcoded info
    const displayApp = app || {
        name: slug === "resume" ? "Resume Builder" : slug === "prd2jira" ? "PRD → Jira" : slug === "meeting" ? "Meeting Notes" : slug,
        slug,
        description: isReal ? "A fully functional AI microapp." : "",
        inputs: [],
        outputDescription: "AI-generated output",
    };

    if (!app && !isReal) notFound();

    return (
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
            <Link href="/showcase" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block">
                ← Back to Showcase
            </Link>

            <div className="glass rounded-2xl p-8 md:p-12 mt-4 animate-slide-up">
                {/* Badge */}
                <div className="flex gap-2 mb-6">
                    {isReal ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30">
                            ✅ Fully Functional
                        </span>
                    ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                            🚧 Stub — Ready to Build
                        </span>
                    )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4">{displayApp.name}</h1>
                <p className="text-muted-foreground text-lg mb-8">{displayApp.description}</p>

                {/* Inputs / Outputs */}
                <div className="grid gap-8 md:grid-cols-2 mb-8">
                    <div className="glass rounded-xl p-6">
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-purple-300">Inputs</h3>
                        {displayApp.inputs && displayApp.inputs.length > 0 ? (
                            <ul className="space-y-2">
                                {displayApp.inputs.map((inp: any) => (
                                    <li key={inp.name} className="flex items-center gap-2 text-sm">
                                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                                        <span className="font-medium">{inp.label}</span>
                                        <span className="text-muted-foreground text-xs">({inp.type})</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">Custom form inputs</p>
                        )}
                    </div>
                    <div className="glass rounded-xl p-6">
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-indigo-300">Output</h3>
                        <p className="text-sm">{displayApp.outputDescription}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                    {isReal ? (
                        <a
                            href={`http://localhost:${realApps[slug]!.port}`}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all glow text-sm"
                        >
                            Open Tool →
                        </a>
                    ) : (
                        <div className="glass rounded-lg p-4 w-full font-mono text-xs">
                            <span className="text-muted-foreground"># Scaffold this microapp:</span><br />
                            <span className="text-green-400">$</span> pnpm --filter @microsaas/cli scaffold --name {slug}
                        </div>
                    )}
                    <button
                        className="px-6 py-3 rounded-lg glass glass-hover font-semibold text-sm"
                    >
                        📤 Share
                    </button>
                </div>
            </div>

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        name: displayApp.name,
                        description: displayApp.description,
                        applicationCategory: "BusinessApplication",
                        operatingSystem: "Web",
                        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                    }),
                }}
            />
        </div>
    );
}
