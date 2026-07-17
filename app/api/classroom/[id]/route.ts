import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { getClassroomDetails } from "@/lib/server/classroomDetails"

async function individualPage(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
        if (!token || !token.id) {
            return NextResponse.json({ message: "Login and Try again" }, { status: 401 })
        }

        const { id } = await params
        const classroomId = parseInt(id)

        const { classroom, role } = await getClassroomDetails(classroomId, Number(token.id))

        return NextResponse.json({ classroom, role }, { status: 200 })

    } catch (err) {
        if (err instanceof Error && err.message === "CLASSROOM_NOT_FOUND") {
            return NextResponse.json({ message: "Classroom Not Found" }, { status: 404 })
        }
        if (err instanceof Error && err.message === "NOT_ENROLLED") {
            return NextResponse.json({ message: "Not enrolled" }, { status: 403 })
        }
        console.error(err)
        return NextResponse.json({ message: "Internal error " }, { status: 500 })
    }
}

export { individualPage as GET }