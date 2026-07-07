import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 });
    }

    try {
        const userId = Number(token.id);

        await prisma.notification.deleteMany({
            where: { userId: userId }
        });

        return NextResponse.json({ message: "All notifications cleared" }, { status: 200 });
    } catch (err) {
        console.error("Clear all notifications error:", err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}