import { Button } from "@microsaas/ui";
import { siteConfig } from "@microsaas/content";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
                <h1 className="text-6xl font-bold text-center tracking-tight">
                    {siteConfig.name}
                </h1>
                <p className="text-xl text-center text-muted-foreground max-w-2xl">
                    {siteConfig.description}
                </p>
                <div className="flex gap-4 mt-8">
                    <Button size="lg" asChild>
                        <a href="/login">Get Started</a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <a href="http://localhost:3001">Go to Studio</a>
                    </Button>
                </div>
            </div>
        </main>
    );
}
