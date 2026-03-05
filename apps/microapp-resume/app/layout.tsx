import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
    title: "Resume Bullet Factory | MicroSaaS",
    description: "Generate ATS-optimized resume bullets instantly using AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-background font-sans antialiased">
                <header className="sticky top-0 z-50 glass border-b border-white/10">
                    <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">📄</span>
                            <span className="font-bold text-sm gradient-text">Resume Bullet Factory</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] px-2 py-1 rounded-full bg-green-500/15 text-green-400 font-bold uppercase tracking-wider border border-green-500/20">
                                ● Live
                            </span>
                            <Link href="http://localhost:3000/tools" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                ← All Tools
                            </Link>
                        </div>
                    </div>
                </header>
                <main className="flex-1">{children}</main>
            </body>
        </html>
    );
}
