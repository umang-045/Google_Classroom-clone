import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; requestid: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const { id, requestid } = await params
        const classId = Number(id)
        const reqId = Number(requestid)

        if (isNaN(classId) || isNaN(reqId)) {
            return NextResponse.json({ message: "Invalid IDs" }, { status: 400 })
        }

        const { action } = await req.json()
        if (action !== "approve" && action !== "reject") {
            return NextResponse.json({ message: "Action must be 'approve' or 'reject'" }, { status: 400 })
        }

        const classroom = await prisma.classroom.findUnique({ where: { id: classId } })
        if (!classroom) {
            return NextResponse.json({ message: "Classroom not found" }, { status: 404 })
        }
        if (classroom.teacherId !== Number(token.id)) {
            return NextResponse.json({ message: "You are not authorized to manage this classroom" }, { status: 403 })
        }

        const joinRequest = await prisma.joinRequest.findUnique({ where: { id: reqId } })
        if (!joinRequest || joinRequest.classroomId !== classId) {
            return NextResponse.json({ message: "Join request not found in this classroom" }, { status: 404 })
        }

        if (action === "approve") {
            await prisma.classroomStudent.create({
                data: { userId: joinRequest.userId, classroomId: joinRequest.classroomId }
            })
            await prisma.joinRequest.delete({ where: { id: reqId } })
            return NextResponse.json({ message: "Student approved and added to classroom" }, { status: 200 })
        } else {
            await prisma.joinRequest.delete({ where: { id: reqId } })
            return NextResponse.json({ message: "Join request rejected" }, { status: 200 })
        }

    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }
}
