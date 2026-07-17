import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { getClassroomRequests } from "@/lib/server/classroomDetails"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const { id } = await params
        const classId = Number(id)

        if (isNaN(classId)) {
            return NextResponse.json({ message: "Invalid classroom ID" }, { status: 400 })
        }

        const { requests } = await getClassroomRequests(classId, Number(token.id))

        return NextResponse.json({ requests }, { status: 200 })

    } catch (err) {
        if (err instanceof Error && err.message === "CLASSROOM_NOT_FOUND") {
            return NextResponse.json({ message: "Classroom not found" }, { status: 404 })
        }
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return NextResponse.json({ message: "You are not authorized to view this classroom's requests" }, { status: 403 })
        }
        console.error(err)
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }
}