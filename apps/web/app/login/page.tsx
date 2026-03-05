import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@microsaas/ui";
import { prisma } from "@microsaas/db";
import { createSession } from "@microsaas/auth/session";
import { setSessionCookie } from "@microsaas/auth/next";
import { redirect } from "next/navigation";

export default function LoginPage() {
    async function handleLogin(formData: FormData) {
        "use server";
        const email = formData.get("email") as string;

        if (!email) return;

        // For local dev, instantly verify and log them in
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({ data: { email } });
        }

        const { token } = await createSession(user.id);
        await setSessionCookie(token);

        redirect("http://localhost:3001"); // Redirect to Studio
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <form action={handleLogin}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            (Local Dev: Submitting will instantly log you in and redirect to Studio)
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit">Sign in with Email</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
