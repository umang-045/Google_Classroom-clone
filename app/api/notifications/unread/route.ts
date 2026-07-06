import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
        if (!token || !token.id) {
            return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
        }
        const userId = Number(token.id)

        const count = await prisma.notification.count({
            where: {
                userId: userId,
                isRead: false,
            },
        });

        return NextResponse.json({ count });
    } catch {
        return NextResponse.json({ message: "Internal server error " }, { status: 500 })
    }
}