export const dynamic = "force-dynamic";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Label } from "@microsaas/ui";
import { prisma } from "@microsaas/db";
import { getSession } from "@microsaas/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function LLMKeysPage() {
    const session = await getSession();
    if (!session) redirect("http://localhost:3000/login");

    const membership = await prisma.membership.findFirst({
        where: { userId: session.userId },
    });

    if (!membership) return <div>No workspace found</div>;

    const keys = await prisma.llmKey.findMany({
        where: { workspaceId: membership.workspaceId },
    });

    const openaiKey = keys.find(k => k.provider === "openai");
    const anthropicKey = keys.find(k => k.provider === "anthropic");

    async function saveKey(formData: FormData) {
        "use server";
        const s = await getSession();
        if (!s) return;
        const m = await prisma.membership.findFirst({ where: { userId: s.userId } });
        if (!m) return;

        const provider = formData.get("provider") as string;
        const key = formData.get("key") as string;

        // Simplistic encryption (obfuscation) for local dev demo
        const encryptedKey = Buffer.from(key).toString("base64");

        await prisma.llmKey.upsert({
            where: {
                workspaceId_provider: {
                    workspaceId: m.workspaceId,
                    provider
                }
            },
            update: { encryptedKey },
            create: {
                workspaceId: m.workspaceId,
                provider,
                encryptedKey
            }
        });

        revalidatePath("/llm-keys");
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">BYOK - LLM Keys</h2>
                <p className="text-muted-foreground">
                    Configure your OpenAI or Anthropic keys for this workspace.
                    If omitted, the factory will fallback to the deterministic DummyProvider.
                </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <form action={saveKey}>
                        <input type="hidden" name="provider" value="openai" />
                        <CardHeader>
                            <CardTitle>OpenAI</CardTitle>
                            <CardDescription>sk-proj-...</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>API Key</Label>
                                <Input name="key" type="password" placeholder="Enter new key to overwrite" />
                            </div>
                            <div className="text-sm">
                                Status: {openaiKey ? <span className="text-green-500 font-bold">Configured</span> : <span className="text-yellow-500 font-bold">Not Set</span>}
                            </div>
                            <Button type="submit">Save Key</Button>
                        </CardContent>
                    </form>
                </Card>

                <Card>
                    <form action={saveKey}>
                        <input type="hidden" name="provider" value="anthropic" />
                        <CardHeader>
                            <CardTitle>Anthropic</CardTitle>
                            <CardDescription>sk-ant-...</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>API Key</Label>
                                <Input name="key" type="password" placeholder="Enter new key to overwrite" />
                            </div>
                            <div className="text-sm">
                                Status: {anthropicKey ? <span className="text-green-500 font-bold">Configured</span> : <span className="text-yellow-500 font-bold">Not Set</span>}
                            </div>
                            <Button type="submit">Save Key</Button>
                        </CardContent>
                    </form>
                </Card>
            </div>
        </div>
    );
}
