import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_local_secret_do_not_use_in_prod"
);

export async function verifyTokenEdge(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (!payload.sessionId || !payload.userId) return null;
        return payload;
    } catch (e) {
        return null;
    }
}
