import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Allow public assets and auth APIs
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/auth") ||
        pathname.includes(".") ||
        pathname === "/login"
    ) {
        return NextResponse.next();
    }

    // 2. Protect everything else
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

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
