import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getToken } from "next-auth/jwt"
import { getSubmissionsForAssignment } from "@/lib/server/assignments";

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

    try {
        const { submissions, requests } = await getSubmissionsForAssignment(classroomId, assignmentId, Number(token.id))
        return NextResponse.json({ submissions, requests })
    } catch (err) {
        if (err instanceof Error && err.message === "FORBIDDEN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
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