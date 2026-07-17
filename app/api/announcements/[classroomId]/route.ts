import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { sendNotificationToClass } from "@/lib/sendNotification";
import { getAnnouncementsForClassroom } from "@/lib/server/announcements";

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

        await sendNotificationToClass({
            classroomId: classId,
            title: "New Announcement",
            message: `A new announcement "${data.title}" has been posted.`,
            type: "ANNOUNCEMENT"
        });
        return NextResponse.json({ message: "Announcement Added" }, { status: 201 })

    } catch (err) {
        console.log(err);
        return NextResponse.json({ messgae: "Internal Error" }, { status: 500 })
    }
}


export async function GET(req: NextRequest, { params }) {
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

        const { allAnnouncement } = await getAnnouncementsForClassroom(classId, Number(token.id))
        return NextResponse.json({ allAnnouncement }, { status: 200 })

    } catch (err) {
        if (err instanceof Error && err.message === "CLASSROOM_NOT_FOUND") {
            return NextResponse.json({ message: "classroom not found" }, { status: 404 })
        }
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
        }
        console.log(err);
        return NextResponse.json({ messgae: "Internal Error" }, { status: 500 })
    }
}