import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

// Add paths that don't require authentication
const publicPaths = ["/login", "/api/auth/login", "/api/auth/logout"];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check if the path is public
    const isPublicPath = publicPaths.some(p => path.startsWith(p));

    // Skip middleware for static files and public paths
    if (
        isPublicPath ||
        path.includes(".png") ||
        path.includes(".jpg") ||
        path.includes(".svg")
    ) {
        return NextResponse.next();
    }

    const session = request.cookies.get("session")?.value;

    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        await decrypt(session);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    ],
};
