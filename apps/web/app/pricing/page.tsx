import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing",
    description: "MicroSaaS Factory is free and open-source. Commercial licenses available for businesses.",
};

const tiers = [
    {
        name: "Personal",
        price: "Free",
        period: "forever",
        description: "For individual developers and personal projects.",
        features: [
            "All 30+ microapps",
            "DummyProvider (no API key needed)",
            "BYOK: OpenAI & Anthropic",
            "Local SQLite database",
            "Full source code access",
            "Community support via GitHub",
        ],
        cta: { label: "Get Started", href: "https://github.com/raj200501/MicroSaaS-Factory" },
        highlighted: false,
    },
    {
        name: "Commercial",
        price: "$99",
        period: "one-time",
        description: "For businesses deploying to production or reselling.",
        features: [
            "Everything in Personal",
            "Commercial use license",
            "Remove attribution requirement",
            "Priority GitHub issues",
            "Early access to new microapps",
            "Invoice available on request",
        ],
        cta: { label: "Request License", href: "mailto:raj200501@gmail.com?subject=MicroSaaS%20Commercial%20License" },
        highlighted: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "Custom builds, white-label, and dedicated support.",
        features: [
            "Everything in Commercial",
            "White-label & custom branding",
            "Custom microapp development",
            "Dedicated support channel",
            "Deployment assistance",
            "SLA available",
        ],
        cta: { label: "Contact Us", href: "mailto:raj200501@gmail.com?subject=MicroSaaS%20Enterprise" },
        highlighted: false,
    },
];

export default function PricingPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-16 max-w-6xl">
            <div className="text-center mb-16 animate-slide-up">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Simple, <span className="gradient-text">honest pricing</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                    Free for personal use. One-time payment for commercial. No subscriptions, no vendor lock-in.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {tiers.map((tier) => (
                    <div
                        key={tier.name}
                        className={`glass rounded-2xl p-8 relative overflow-hidden ${tier.highlighted ? "glow border-purple-500/30" : ""
                            }`}
                    >
                        {tier.highlighted && (
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
                        )}
                        <h3 className="font-bold text-xl mb-2">{tier.name}</h3>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-4xl font-black gradient-text">{tier.price}</span>
                            {tier.period && <span className="text-sm text-muted-foreground">/{tier.period}</span>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>
                        <ul className="space-y-3 mb-8">
                            {tier.features.map((f) => (
                                <li key={f} className="flex items-start gap-2 text-sm">
                                    <span className="text-green-400 mt-0.5">✓</span>
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                        <a
                            href={tier.cta.href}
                            className={`block text-center px-6 py-3 rounded-lg font-semibold text-sm transition-all ${tier.highlighted
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 glow"
                                    : "glass glass-hover"
                                }`}
                        >
                            {tier.cta.label}
                        </a>
                    </div>
                ))}
            </div>

            {/* Support */}
            <div className="mt-16 glass rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-3">Support Open Source</h2>
                <p className="text-muted-foreground max-w-lg mx-auto mb-6 text-sm">
                    MicroSaaS Factory is independently maintained. If it helps your business, consider sponsoring.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <a
                        href="https://github.com/sponsors/raj200501"
                        target="_blank"
                        rel="noopener"
                        className="px-6 py-3 rounded-lg glass glass-hover font-semibold text-sm"
                    >
                        ❤️ GitHub Sponsors
                    </a>
                    <a
                        href="mailto:raj200501@gmail.com?subject=MicroSaaS%20Sponsorship"
                        className="px-6 py-3 rounded-lg glass glass-hover font-semibold text-sm"
                    >
                        ✉️ Enterprise Inquiry
                    </a>
                </div>
            </div>
        </div>
    );
}
