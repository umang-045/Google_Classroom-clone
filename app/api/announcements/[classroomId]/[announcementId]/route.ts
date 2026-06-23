import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ classroomId: string; announcementId: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const { classroomId, announcementId } = await params;
        const classId = Number(classroomId)
        const announceId = Number(announcementId)

        if (isNaN(classId) || isNaN(announceId)) {
            return NextResponse.json({ message: "Invalid IDs" }, { status: 400 })
        }

        const existing = await prisma.classroom.findUnique({ where: { id: classId } })
        if (!existing) {
            return NextResponse.json({ message: "classroom not found" }, { status: 404 })
        }

        const teacherId = existing.teacherId

        if (teacherId != Number(token.id)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
        }

        const announcement = await prisma.announcement.findUnique({ where: { id: announceId } })
        if (!announcement || announcement.classroomId !== classId) {
            return NextResponse.json({ message: "Announcement not found in this classroom" }, { status: 404 })
        }

        await prisma.announcement.delete({
            where: { id: announceId }
        })
        return NextResponse.json({ message: "Delete Successfull" }, { status: 200 })

    } catch (err) {
        console.log(err);
        return NextResponse.json({ messgae: "Internal Error" }, { status: 500 })
    }
}