import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://microsaas.dev";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "MicroSaaS Factory — AI Microapps You Can Ship Today",
        template: "%s | MicroSaaS Factory",
    },
    description: "Open-source platform to build, ship, and monetize 30+ AI-powered microapps. Zero paid SaaS. BYOK. Local SQLite.",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteUrl,
        siteName: "MicroSaaS Factory",
        title: "MicroSaaS Factory — AI Microapps You Can Ship Today",
        description: "Open-source platform with 30+ AI microapps. Zero paid SaaS dependencies.",
        images: [{ url: "/api/og", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "MicroSaaS Factory",
        description: "30+ AI microapps, zero SaaS dependencies, ship today.",
    },
    robots: { index: true, follow: true },
};

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/tools", label: "Tools" },
    { href: "/showcase", label: "Showcase" },
    { href: "/docs", label: "Docs" },
    { href: "/pricing", label: "Pricing" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-background font-sans antialiased">
                {/* Nav */}
                <header className="sticky top-0 z-50 w-full glass border-b border-white/10">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                            <span className="text-2xl">⚡</span>
                            <span className="gradient-text">MicroSaaS Factory</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/login"
                                className="text-sm px-4 py-2 rounded-lg bg-primary/20 text-primary-foreground hover:bg-primary/30 transition-colors border border-primary/30"
                            >
                                Sign In
                            </Link>
                        </nav>
                    </div>
                </header>

                {/* Main */}
                <main className="flex-1">{children}</main>

                {/* Footer */}
                <footer className="border-t border-white/10 mt-20">
                    <div className="container mx-auto px-4 md:px-6 py-12">
                        <div className="grid gap-8 md:grid-cols-4">
                            <div>
                                <h3 className="font-bold mb-3 gradient-text">MicroSaaS Factory</h3>
                                <p className="text-sm text-muted-foreground">
                                    Open-source AI microapp platform. Zero paid SaaS. Ship today.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-3 text-sm">Product</h4>
                                <div className="flex flex-col gap-2">
                                    <Link href="/showcase" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Showcase</Link>
                                    <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                                    <Link href="/roadmap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Roadmap</Link>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-3 text-sm">Resources</h4>
                                <div className="flex flex-col gap-2">
                                    <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
                                    <Link href="/launch-kit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Launch Kit</Link>
                                    <Link href="/license" className="text-sm text-muted-foreground hover:text-foreground transition-colors">License</Link>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-3 text-sm">Connect</h4>
                                <div className="flex flex-col gap-2">
                                    <a href="https://github.com/raj200501/MicroSaaS-Factory" target="_blank" rel="noopener" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
                                    <Link href="/hire" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Hire / Consulting</Link>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-white/10 mt-8 pt-8 text-center text-xs text-muted-foreground">
                            © {new Date().getFullYear()} MicroSaaS Factory. Open Source.
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
}
