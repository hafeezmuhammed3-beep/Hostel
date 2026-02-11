import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.password !== password) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Create the session
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const session = await encrypt({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            expires
        });

        // Save the session in a cookie
        const cookieStore = await cookies();
        cookieStore.set("session", session, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        return NextResponse.json({ success: true, user: { name: user.name, role: user.role } });
    } catch (error: any) {
        // Log the full error to Vercel Logs
        console.error("CRITICAL LOGIN ERROR:", error);

        // Return a very specific error to the screen
        const errorMessage = error.message || "Unknown error";
        const errorType = error.constructor?.name || "Error";

        return NextResponse.json(
            { error: `Database Error: [${errorType}] ${errorMessage}` },
            { status: 500 }
        );
    }
}
