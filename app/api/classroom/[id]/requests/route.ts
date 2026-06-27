import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";

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

        const classroom = await prisma.classroom.findUnique({ where: { id: classId } })
        if (!classroom) {
            return NextResponse.json({ message: "Classroom not found" }, { status: 404 })
        }
        if (classroom.teacherId !== Number(token.id)) {
            return NextResponse.json({ message: "You are not authorized to view this classroom's requests" }, { status: 403 })
        }

        const requests = await prisma.joinRequest.findMany({
            where: { classroomId: classId },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { requested_at: 'desc' }
        })

        return NextResponse.json({ requests }, { status: 200 })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }
}