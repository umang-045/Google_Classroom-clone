import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";


export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || !token.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const userId = Number(token.id);

        const notifications = await prisma.notification.findMany({
            where: {
                userId
            },
            orderBy: {
                created_at: "desc"
            },
            include: {
                classroom: {
                    select: {
                        className: true
                    }
                }
            }
        });

        return NextResponse.json({ notifications },{status:200});
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}


export async function PUT(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || !token.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const userId = Number(token.id);

        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });

        return NextResponse.json({ success: true },{status:202});
    } catch (error) {
        console.error("Error updating notifications:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}