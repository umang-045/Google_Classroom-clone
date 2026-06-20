import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getToken } from "next-auth/jwt"

interface dataProp {
    marks: number,
    feedback: string,
    studentId: number
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ classroomId: string; assignmentId: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const { classroomId: classroomid, assignmentId: assignmentid } = await params
        const classroomId = Number(classroomid)
        const assignmentId = Number(assignmentid)

        if (isNaN(classroomId) || isNaN(assignmentId)) {
            return NextResponse.json({ message: "Invalid IDs" }, { status: 400 })
        }

        const data: dataProp = await req.json()
        if (data.marks===undefined || !data.feedback || !data.studentId) {
            return NextResponse.json({ message: "Fill the details" }, { status: 400 })
        }
        const teacher = await prisma.assignment.findUnique({
            where: {
                id: assignmentId
            },
            select: {
                teacherId: true
            }
        })

        if (!teacher || teacher.teacherId != Number(token.id)) {
            return NextResponse.json({ message: "You are not authorized to grade this assignment" }, { status: 403 })
        }

        await prisma.submission.update({
            data: {
                marks: data.marks,
                feedback: data.feedback
            },
            where: {
                studentId_assignmentId: {
                    studentId: data.studentId,
                    assignmentId: assignmentId
                }
            }
        })
        return NextResponse.json({ message: "Grading done Successfully" }, { status: 200 })

    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }

}