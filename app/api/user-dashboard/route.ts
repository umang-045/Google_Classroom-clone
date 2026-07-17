import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getUserDashboardData } from "@/lib/server/userDashboard";

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try again" }, { status: 400 });
    }

    const userId = Number(token.id);

    try {
        const result = await getUserDashboardData(userId)
        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        if (err instanceof Error && err.message === "USER_NOT_FOUND") {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        console.log(err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}