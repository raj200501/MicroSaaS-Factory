import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Notes -> Actions",
    description: "Extract action items and draft follow-ups from meeting notes.",
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
                    <header className="sticky top-0 flex h-16 items-center border-b bg-background px-4 md:px-6">
                        <span className="font-semibold text-lg tracking-tight">Meeting Notes to Actions</span>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
