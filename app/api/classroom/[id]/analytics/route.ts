import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { getClassroomAnalytics } from "@/lib/server/analytics"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const { id } = await params
        const classId = Number(id)

        const result = await getClassroomAnalytics(classId, Number(token.id))
        return NextResponse.json(result, { status: 200 })

    } catch (err) {
        if (err instanceof Error && err.message === "CLASSROOM_NOT_FOUND") {
            return NextResponse.json({ message: "Classroom not found" }, { status: 404 })
        }
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
        }
        console.log(err)
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }
}