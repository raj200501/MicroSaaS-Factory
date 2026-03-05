import Link from "next/link";
import fs from "fs/promises";
import path from "path";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Showcase — 30+ AI Microapps",
    description: "Explore our collection of 30+ AI-powered microapps. Filter by category, see what's live, and try demos.",
};

const categories = ["All", "Marketing", "Sales", "HR", "Dev Tools", "Content", "Education"];

const realSlugs = new Set(["resume", "prd2jira", "meeting"]);

function getCategory(slug: string): string {
    const map: Record<string, string> = {
        "email-subject": "Marketing", "tweet-thread": "Content", "seo-meta": "Marketing",
        "blog-outline": "Content", "youtube-ideas": "Content", "product-desc": "Marketing",
        "ad-copy": "Marketing", "cold-email": "Sales", "press-release": "Marketing",
        "cover-letter": "HR", "welcome-email": "Marketing", "sales-script": "Sales",
        "interview-qa": "HR", "user-persona": "Marketing", "faq-gen": "Content",
        "slogan-maker": "Marketing", "value-prop": "Marketing", "test-rewrite": "Marketing",
        "job-desc": "HR", "mission": "Marketing", "elevator-pitch": "Sales",
        "namer": "Dev Tools", "course-curriculum": "Education", "podcast-intro": "Content",
        "landing-page": "Marketing", "newsletter": "Content", "eli5": "Education",
        "code-explain": "Dev Tools", "regex-gen": "Dev Tools", "sql-gen": "Dev Tools",
        "resume": "HR", "prd2jira": "Dev Tools", "meeting": "Content",
    };
    return map[slug] || "Content";
}

export default async function ShowcasePage() {
    const jsonPath = path.join(process.cwd(), "../../docs/microapps-30.json");
    const fileContents = await fs.readFile(jsonPath, "utf8");
    const apps = JSON.parse(fileContents) as Array<{ slug: string; name: string; description: string; outputDescription: string }>;

    // Add the 3 real apps at the top
    const realApps = [
        { slug: "resume", name: "Resume Builder", description: "Generate impact-driven resume bullets.", outputDescription: "Categorized bullet points" },
        { slug: "prd2jira", name: "PRD → Jira", description: "Convert PRDs to epics and tickets.", outputDescription: "Structured tickets with estimates" },
        { slug: "meeting", name: "Meeting Notes", description: "Extract action items from meeting transcripts.", outputDescription: "Action items + follow-up email" },
    ];
    const allApps = [...realApps, ...apps];

    return (
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-7xl">
            {/* Header */}
            <div className="mb-12 animate-slide-up">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                    <span className="gradient-text">Microapp Showcase</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    Explore {allApps.length}+ single-purpose AI tools. 3 are fully functional, the rest are ready to be built.
                </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                    <span
                        key={cat}
                        className="px-4 py-1.5 rounded-full text-xs font-medium glass glass-hover cursor-pointer"
                    >
                        {cat}
                    </span>
                ))}
            </div>

            {/* Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {allApps.map((app) => {
                    const isReal = realSlugs.has(app.slug);
                    const category = getCategory(app.slug);
                    return (
                        <Link
                            key={app.slug}
                            href={`/showcase/${app.slug}`}
                            className="glass rounded-xl p-6 glass-hover group relative overflow-hidden block"
                        >
                            {/* Hover gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                {/* Badges */}
                                <div className="flex gap-2 mb-4">
                                    {isReal ? (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-green-500/20 text-green-300 border border-green-500/30">
                                            LIVE
                                        </span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                                            STUB
                                        </span>
                                    )}
                                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-muted-foreground">
                                        {category}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-base mb-1.5 group-hover:text-white transition-colors">
                                    {app.name}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{app.description}</p>
                                <div className="text-xs text-purple-300/80">
                                    Output: {app.outputDescription}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
