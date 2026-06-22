import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest, { params }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const { classroomId } = await params;
        const classId = Number(classroomId)
        if (isNaN(classId)) {
            return NextResponse.json({ message: "Invalid classroom ID" }, { status: 400 })
        }
        const data = await req.json()
        if (!data || !data.title || !data.content) {
            return NextResponse.json({ message: "Fill up the entire details" }, { status: 400 })
        }

        const existing = await prisma.classroom.findUnique({ where: { id: classId } })
        if (!existing) {
            return NextResponse.json({ message: "classroom not found" }, { status: 404 })
        }

        const teacherId = existing.teacherId

        if (teacherId != Number(token.id)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
        }

        await prisma.announcement.create({
            data: {
                title: data.title,
                content: data.content,
                classroomId: classId,
                teacherId: teacherId
            }
        })
        return NextResponse.json({ message: "Announcement Added" }, { status: 201 })

    } catch (err) {
        console.log(err);
        return NextResponse.json({ messgae: "Internal Error" }, { status: 500 })
    }
}


