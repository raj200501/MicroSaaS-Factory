import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
    title: "MicroSaaS Studio",
    description: "Internal admin dashboard",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-background font-sans antialiased">
                <div className="flex min-h-screen w-full flex-col">
                    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                        <span className="font-semibold text-lg tracking-tight">Studio</span>
                        <nav className="flex items-center gap-6 text-sm font-medium">
                            <Link href="/" className="hover:text-foreground">Dashboard</Link>
                            <Link href="/workspaces" className="text-muted-foreground hover:text-foreground">Workspaces</Link>
                            <Link href="/installs" className="text-muted-foreground hover:text-foreground">Installs</Link>
                            <Link href="/llm-keys" className="text-muted-foreground hover:text-foreground">Keys</Link>
                            <Link href="/runs" className="text-muted-foreground hover:text-foreground">Runs</Link>
                            <Link href="/events" className="text-muted-foreground hover:text-foreground">Events</Link>
                            <Link href="/email" className="text-muted-foreground hover:text-foreground">Email</Link>
                        </nav>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
