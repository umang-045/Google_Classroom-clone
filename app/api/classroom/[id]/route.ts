import { NextResponse, NextRequest } from "next/server"
import  prisma  from "../../../../lib/db"
import { getToken } from "next-auth/jwt"

async function individualPage(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
        if (!token || !token.id) {
            return NextResponse.json({ message: "Login and Try again" }, { status: 401 })
        }

        const { id } = await params
        const classroomId = parseInt(id)

        const classroom = await prisma.classroom.findUnique({ where: { id: classroomId }, include: {teacher: { select: { name: true, email: true } },students: { select: { user: { select: { name: true, email: true } } } } }})

        if (!classroom) {
            return NextResponse.json({ message: "Classroom Not Found" }, { status: 404 })
        }

        return NextResponse.json({ classroom }, { status: 200 })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Internal error " }, { status: 500 })
    }
}

export { individualPage as GET }