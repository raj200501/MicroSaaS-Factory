import type { Metadata } from "next";
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
                        <nav className="hidden md:flex gap-6 text-sm font-medium ml-6">
                            <a href="/" className="text-foreground transition-colors hover:text-foreground">Dashboard</a>
                            <a href="/microapps" className="text-muted-foreground transition-colors hover:text-foreground">Microapps</a>
                            <a href="/events" className="text-muted-foreground transition-colors hover:text-foreground">Events</a>
                            <a href="/emails" className="text-muted-foreground transition-colors hover:text-foreground">Emails</a>
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
