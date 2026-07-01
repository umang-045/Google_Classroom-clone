import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/db"
import { getToken } from "next-auth/jwt"

interface dataProp {
    fileUrl: string
    assignmentId: number
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ classroomId: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }

    try {
        const { classroomId } = await params
        const id = Number(classroomId)
        const data: dataProp = await req.json()

        const existingClassroom = await prisma.classroom.findUnique({ where: { id } })
        if (!existingClassroom) {
            return NextResponse.json({ message: "Classroom not found" }, { status: 404 })
        }

        const studentEnrollment = await prisma.classroomStudent.findUnique({
            where: {
                userId_classroomId: {
                    userId: Number(token.id),
                    classroomId: id
                }
            }
        })
        
        if (!studentEnrollment) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
        }

        const assignment = await prisma.assignment.findUnique({
            where: { id: data.assignmentId }
        })

        if (!assignment) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 })
        }

        if (assignment.due_at && new Date(assignment.due_at) < new Date()) {
            return NextResponse.json({ message: "Due date has passed. Submission not allowed." }, { status: 400 })
        }

        const alreadySubmitted = await prisma.submission.findUnique({
            where: {
                studentId_assignmentId: {
                    studentId: Number(token.id),
                    assignmentId: data.assignmentId
                }
            }
        })

        if (alreadySubmitted) {
            return NextResponse.json({ message: "Already Submitted" }, { status: 400 })
        }

        const newSubmission = await prisma.submission.create({
            data: {
                fileUrl: data.fileUrl,
                assignmentId: data.assignmentId,
                studentId: Number(token.id)
            }
        })

        return NextResponse.json({ message: "Submitted", submission: newSubmission }, { status: 200 })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }
}