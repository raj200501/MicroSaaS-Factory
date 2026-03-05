import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Roadmap",
    description: "See what's being built next in MicroSaaS Factory.",
};

const phases = [
    {
        phase: "Now — Live",
        status: "done",
        items: [
            { name: "Resume Builder", description: "Impact-driven bullet generation with PDF export", done: true },
            { name: "PRD → Jira", description: "Convert PRDs to epics and tickets with CSV/MD export", done: true },
            { name: "Meeting Notes", description: "Action items extraction and follow-up email drafting", done: true },
        ],
    },
    {
        phase: "Next Up",
        status: "in-progress",
        items: [
            { name: "Email Subject Line Generator", description: "Generate high-converting subject lines", done: false },
            { name: "Blog Post Outline", description: "Create structured outlines with headings", done: false },
            { name: "Cover Letter Builder", description: "Job-specific cover letters in seconds", done: false },
            { name: "Code Explainer", description: "Plain-English explanations of code snippets", done: false },
        ],
    },
    {
        phase: "Planned",
        status: "planned",
        items: [
            { name: "SQL Query Builder", description: "Natural language to SQL conversion", done: false },
            { name: "Cold Outreach Email", description: "Personalized B2B cold emails", done: false },
            { name: "Ad Copy Generator", description: "Facebook ad copy variations", done: false },
            { name: "Interview Questions", description: "Role-specific behavioral and technical questions", done: false },
            { name: "Regex Generator", description: "Pattern generation from descriptions", done: false },
            { name: "Landing Page Copy", description: "Hero section copywriting", done: false },
        ],
    },
];

export default function RoadmapPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-16 max-w-4xl">
            <div className="mb-12 animate-slide-up">
                <h1 className="text-4xl font-bold mb-4">
                    <span className="gradient-text">Roadmap</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    From stub to shipped. Here&apos;s what&apos;s live and what&apos;s next.
                </p>
            </div>

            <div className="space-y-12">
                {phases.map((phase) => (
                    <div key={phase.phase}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-3 h-3 rounded-full ${phase.status === "done" ? "bg-green-400" :
                                    phase.status === "in-progress" ? "bg-yellow-400 animate-pulse" :
                                        "bg-white/20"
                                }`} />
                            <h2 className="text-xl font-bold">{phase.phase}</h2>
                        </div>
                        <div className="space-y-3 ml-6 border-l border-white/10 pl-6">
                            {phase.items.map((item) => (
                                <div key={item.name} className="glass rounded-lg p-4 glass-hover">
                                    <div className="flex items-center gap-2">
                                        <span className={item.done ? "text-green-400" : "text-muted-foreground"}>
                                            {item.done ? "✅" : "⬜"}
                                        </span>
                                        <h3 className="font-semibold text-sm">{item.name}</h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 ml-6">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 glass rounded-xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                    Want to see a specific tool built next? Open an issue or contribute!
                </p>
                <a
                    href="https://github.com/raj200501/MicroSaaS-Factory/issues"
                    target="_blank"
                    rel="noopener"
                    className="px-6 py-3 rounded-lg glass glass-hover font-semibold text-sm inline-block"
                >
                    Request a Tool →
                </a>
            </div>
        </div>
    );
}
