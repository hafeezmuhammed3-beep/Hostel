import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.set("session", "", { expires: new Date(0) });
    return NextResponse.json({ success: true });
}
