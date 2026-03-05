import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hire / Custom Builds",
    description: "Need a custom AI microapp built? Let's talk.",
};

export default function HirePage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-16 max-w-3xl">
            <div className="mb-12 animate-slide-up">
                <h1 className="text-4xl font-bold mb-4">
                    <span className="gradient-text">Custom Builds & Consulting</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    Need a custom AI microapp or want to deploy MicroSaaS Factory for your team? Let&apos;s build it.
                </p>
            </div>

            <div className="space-y-6">
                <div className="glass rounded-xl p-8 glass-hover">
                    <h3 className="font-bold text-lg mb-2">🛠️ Custom Microapp Development</h3>
                    <p className="text-sm text-muted-foreground">
                        I&apos;ll build a production-ready microapp tailored to your workflow — integrated into this platform or standalone.
                    </p>
                </div>
                <div className="glass rounded-xl p-8 glass-hover">
                    <h3 className="font-bold text-lg mb-2">🏢 Enterprise Deployment</h3>
                    <p className="text-sm text-muted-foreground">
                        Need MicroSaaS Factory deployed and configured for your organization? I&apos;ll handle setup, branding, and training.
                    </p>
                </div>
                <div className="glass rounded-xl p-8 glass-hover">
                    <h3 className="font-bold text-lg mb-2">🎓 Technical Consulting</h3>
                    <p className="text-sm text-muted-foreground">
                        Architecture reviews, AI integration strategy, or monorepo best practices. Book a session.
                    </p>
                </div>
            </div>

            <div className="mt-12 glass rounded-xl p-8 text-center glow">
                <h2 className="text-2xl font-bold mb-4">Ready to talk?</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Drop me an email and I&apos;ll get back to you within 24 hours.
                </p>
                <a
                    href="mailto:raj200501@gmail.com?subject=MicroSaaS%20Custom%20Build"
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm inline-block hover:from-purple-500 hover:to-indigo-500 transition-all"
                >
                    ✉️ raj200501@gmail.com
                </a>
            </div>
        </div>
    );
}
