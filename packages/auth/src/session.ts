import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@microsaas/db";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_local_secret_do_not_use_in_prod"
);

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await prisma.session.create({
        data: {
            userId,
            expiresAt,
        },
    });

    const token = await new SignJWT({ sessionId: session.id, userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(JWT_SECRET);

    return { token, session };
}

export async function verifySession(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (!payload.sessionId || !payload.userId) return null;

        const session = await prisma.session.findUnique({
            where: { id: payload.sessionId as string },
            include: { user: true },
        });

        if (!session || session.expiresAt < new Date()) {
            return null;
        }

        return session;
    } catch (e) {
        return null;
    }
}

export async function invalidateSession(sessionId: string) {
    await prisma.session.delete({
        where: { id: sessionId },
    });
}
