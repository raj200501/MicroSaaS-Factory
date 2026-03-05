import { cookies } from "next/headers";
import { verifySession, invalidateSession } from "./session";

export const SESSION_COOKIE_NAME = "microsaas_session";

export async function setSessionCookie(token: string) {
    cookies().set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });
}

export async function clearSessionCookie() {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
        const session = await verifySession(token);
        if (session) {
            await invalidateSession(session.id);
        }
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession() {
    const token = cookies().get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySession(token);
}
