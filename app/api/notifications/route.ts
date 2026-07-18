import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getNotifications, markNotificationsRead } from "@/lib/server/notifications";


export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || !token.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const userId = Number(token.id);

        const notifications = await getNotifications(userId);

        return NextResponse.json({ notifications }, { status: 200 });
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

        const result = await markNotificationsRead(userId);

        return NextResponse.json(result, { status: 202 });
    } catch (error) {
        console.error("Error updating notifications:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}