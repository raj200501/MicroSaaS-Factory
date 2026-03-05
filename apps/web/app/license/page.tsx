import { Metadata } from "next";

export const metadata: Metadata = {
    title: "License",
    description: "MicroSaaS Factory licensing — free for personal use, commercial licenses available.",
};

export default function LicensePage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-16 max-w-3xl">
            <div className="mb-12 animate-slide-up">
                <h1 className="text-4xl font-bold mb-4">
                    <span className="gradient-text">License</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    MicroSaaS Factory uses a dual-license model to support sustainable open-source development.
                </p>
            </div>

            <div className="space-y-8">
                <div className="glass rounded-xl p-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-green-400">🆓</span> Personal / Open Source License
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        MicroSaaS Factory is licensed under the <strong>MIT License</strong> for personal use,
                        learning, and non-commercial open-source projects.
                    </p>
                    <ul className="space-y-2 text-sm">
                        <li className="flex gap-2"><span className="text-green-400">✓</span> Use for personal projects</li>
                        <li className="flex gap-2"><span className="text-green-400">✓</span> Learn and modify freely</li>
                        <li className="flex gap-2"><span className="text-green-400">✓</span> Contribute back to the community</li>
                        <li className="flex gap-2"><span className="text-green-400">✓</span> Attribution appreciated but not required</li>
                    </ul>
                </div>

                <div className="glass rounded-xl p-8 glow border-purple-500/20">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-purple-400">💼</span> Commercial License
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        If you&apos;re using MicroSaaS Factory in a commercial product, SaaS, or client project,
                        a <strong>one-time commercial license</strong> is required.
                    </p>
                    <ul className="space-y-2 text-sm mb-6">
                        <li className="flex gap-2"><span className="text-purple-400">✓</span> Deploy to production for paying customers</li>
                        <li className="flex gap-2"><span className="text-purple-400">✓</span> Remove attribution requirement</li>
                        <li className="flex gap-2"><span className="text-purple-400">✓</span> White-label and rebrand</li>
                        <li className="flex gap-2"><span className="text-purple-400">✓</span> Priority support</li>
                    </ul>
                    <a
                        href="mailto:raj200501@gmail.com?subject=MicroSaaS%20Commercial%20License"
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm inline-block hover:from-purple-500 hover:to-indigo-500 transition-all"
                    >
                        Request Commercial License →
                    </a>
                </div>

                <div className="glass rounded-xl p-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span>❤️</span> Support Open Source
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        MicroSaaS Factory is independently built and maintained. Your support keeps it alive.
                    </p>
                    <a
                        href="https://github.com/sponsors/raj200501"
                        target="_blank"
                        rel="noopener"
                        className="px-6 py-3 rounded-lg glass glass-hover font-semibold text-sm inline-block"
                    >
                        Sponsor on GitHub →
                    </a>
                </div>
            </div>
        </div>
    );
}
