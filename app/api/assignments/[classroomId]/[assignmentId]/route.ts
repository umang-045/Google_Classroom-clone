import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getToken } from "next-auth/jwt"

export async function GET(req: NextRequest, { params }: { params: Promise<{ classroomId: string; assignmentId: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    
    const { classroomId: classroomid, assignmentId: assignmentid } = await params
    const classroomId = Number(classroomid)
    const assignmentId = Number(assignmentid)

    if (isNaN(classroomId) || isNaN(assignmentId)) {
        return NextResponse.json({ message: "Invalid IDs" }, { status: 400 })
    }

 
    const classroom = await prisma.classroom.findUnique({
        where: {
            id: classroomId,
            teacherId: Number(token.id),
        },
    })

    if (!classroom) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const enrolledStudents = await prisma.classroomStudent.findMany({
        where: { classroomId },
        include: {
            user: {
                select: { id: true, name: true, email: true }
            }
        }
    })

    const submissions = await prisma.submission.findMany({
        where: { assignmentId },
    })

   
    const formatted = enrolledStudents.map((enrolled) => {
        const student = enrolled.user
        const submission = submissions.find((s) => s.studentId === student.id)

        return {
            id: submission?.id || `unsubmitted-${student.id}`,
            studentName: student.name || "Unknown Student",
            studentEmail: student.email || "",
            fileUrl: submission?.fileUrl || null,
            submittedAt: submission?.submitted_at || null,
            hasSubmitted: !!submission
        }
    })


    formatted.sort((a, b) => (b.hasSubmitted ? 1 : 0) - (a.hasSubmitted ? 1 : 0))

    return NextResponse.json({ submissions: formatted })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ classroomId: string; assignmentId: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }

    const { classroomId: classroomid, assignmentId: assignmentid } = await params
    const classroomId = Number(classroomid)
    const assignmentId = Number(assignmentid)

    if (isNaN(classroomId) || isNaN(assignmentId)) {
        return NextResponse.json({ message: "Invalid IDs" }, { status: 400 })
    }

    const classroom = await prisma.classroom.findUnique({
        where: {
            id: classroomId,
            teacherId: Number(token.id),
        },
    })

    if (!classroom) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await prisma.submission.deleteMany({ where: { assignmentId } })
    await prisma.assignment.delete({ where: { id: assignmentId } })

    return NextResponse.json({ message: "Assignment deleted" })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ classroomId: string; assignmentId: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }

    const { classroomId: classroomid, assignmentId: assignmentid } = await params
    const classroomId = Number(classroomid)
    const assignmentId = Number(assignmentid)

    if (isNaN(classroomId) || isNaN(assignmentId)) {
        return NextResponse.json({ message: "Invalid IDs" }, { status: 400 })
    }

    const classroom = await prisma.classroom.findUnique({
        where: {
            id: classroomId,
            teacherId: Number(token.id),
        },
    })

    if (!classroom) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, due_at, fileUrl } = body

    if (!title || !description || !due_at) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const updated = await prisma.assignment.update({
        where: { id: assignmentId },
        data: {
            title,
            description,
            due_at: new Date(due_at),
            fileUrl: fileUrl || "",
        },
    })

    return NextResponse.json({ assignment: updated })
}