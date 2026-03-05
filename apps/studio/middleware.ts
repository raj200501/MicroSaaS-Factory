import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@microsaas/auth/edge";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("microsaas_session")?.value;

    // If no token or invalid, redirect to login on web app
    if (!token) {
        return NextResponse.redirect(new URL("http://localhost:3000/login", request.url));
    }

    const payload = await verifyTokenEdge(token);
    if (!payload) {
        return NextResponse.redirect(new URL("http://localhost:3000/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
