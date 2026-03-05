import type { Metadata } from "next";
import { siteConfig } from "@microsaas/content";
import "./globals.css";

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-background font-sans antialiased">
                {children}
            </body>
        </html>
    );
}
