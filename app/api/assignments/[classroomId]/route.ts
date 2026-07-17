import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { getAssignmentsForClassroom } from "@/lib/server/assignments"

export async function GET(req: NextRequest, { params }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const { classroomId } = await params
        const classId = Number(classroomId)
        const { assignments, role } = await getAssignmentsForClassroom(classId, Number(token.id))

        return NextResponse.json(
            { assignments, role },
            { status: 200 }
        )

    } catch (err) {
        if (err instanceof Error && err.message === "CLASSROOM_NOT_FOUND") {
            return NextResponse.json({ message: "classroom not found" }, { status: 404 })
        }
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
        }
        console.log(err)
        return NextResponse.json({ messgae: "Internal Error" }, { status: 500 })
    }
}