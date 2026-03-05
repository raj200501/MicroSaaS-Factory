import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@microsaas/ui";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <form action={async (formData) => {
                    "use server";
                    // Local dev magic link stub: immediately create session or simulate sending email
                    const email = formData.get("email") as string;
                    console.log("Login requested for:", email);
                    // In a real app we would call something like:
                    // await auth.sendMagicLink(email)
                    // For now, this is a visual stub for the web app auth flow
                }}>
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
                        {/* For local dev testing, bypass magic link */}
                        <p className="text-xs text-muted-foreground text-center">
                            (Local Dev: Submitting will stub auth and redirect to Studio)
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
