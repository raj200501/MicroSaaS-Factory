import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@microsaas/ui";
import { prisma, resolveWorkspace } from "@microsaas/db";
import { createSession } from "@microsaas/auth/session";
import { setSessionCookie } from "@microsaas/auth/next";
import { redirect } from "next/navigation";

export default function LoginPage() {
    async function handleLogin(formData: FormData) {
        "use server";
        const email = formData.get("email") as string;
        if (!email) return;

        // Upsert user
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({ data: { email, name: email.split("@")[0] } });
        }

        // Ensure workspace + membership exist
        await resolveWorkspace(user.id);

        // Create session
        const { token } = await createSession(user.id);
        await setSessionCookie(token);

        redirect("/account");
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <form action={handleLogin}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Sign In</CardTitle>
                        <CardDescription>
                            Enter your email to sign in instantly. No password needed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Local dev mode — instant login, no verification needed.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit">Sign In →</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
