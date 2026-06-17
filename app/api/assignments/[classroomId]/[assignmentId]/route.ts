import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getToken } from "next-auth/jwt"


export async function GET(req: NextRequest, { params }: { params:Promise< { classroomId: string; assignmentId: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    const classroomid= (await params).classroomId
    const assignmentid= (await params).assignmentId

    const classroomId = Number(classroomid)
    const assignmentId = Number(assignmentid)

    if (isNaN(classroomId) || isNaN(assignmentId)) {
        return NextResponse.json({ message: "Invalid IDs" }, { status: 400 })
    }

    const classroom = await prisma.classroom.findUnique({
        where: {
            id: classroomId,
            teacherId:Number(token.id),
        },
    })

    if (!classroom) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const submissions = await prisma.submission.findMany({
        where: { assignmentId },
        include: {
            student: {
                select: { id: true, name: true, email: true },
            },
        },
        orderBy: { submitted_at: "asc" },
    })

    const formatted = submissions.map((s) => ({
        id: s.id,
        studentName: s.student.name,
        studentEmail: s.student.email,
        fileUrl: s.fileUrl,
        submittedAt: s.submitted_at,
    }))

    return NextResponse.json({ submissions: formatted })
}


export async function DELETE(req: NextRequest,{ params }: { params:Promise< { classroomId: string; assignmentId: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }

    const classroomid= (await params).classroomId
    const assignmentid= (await params).assignmentId

    const classroomId = Number(classroomid)
    const assignmentId = Number(assignmentid)


    if (isNaN(classroomId) || isNaN(assignmentId)) {
        return NextResponse.json({ message: "Invalid IDs" }, { status: 400 })
    }

    const classroom = await prisma.classroom.findUnique({
        where: {
            id: classroomId,
            teacherId:Number(token.id),
        },
    })


    if (!classroom) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await prisma.submission.deleteMany({ where: { assignmentId } })
    await prisma.assignment.delete({ where: { id: assignmentId } })

    return NextResponse.json({ message: "Assignment deleted" })
}

export async function PATCH(req: NextRequest,{ params }: { params:Promise< { classroomId: string; assignmentId: string }> }) {
   const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }


 const classroomid= (await params).classroomId
    const assignmentid= (await params).assignmentId

    const classroomId = Number(classroomid)
    const assignmentId = Number(assignmentid)


    if (isNaN(classroomId) || isNaN(assignmentId)) {
        return NextResponse.json({ message: "Invalid IDs" }, { status: 400 })
    }

   const classroom = await prisma.classroom.findUnique({
        where: {
            id: classroomId,
            teacherId:Number(token.id),
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