import { NextResponse, NextRequest } from "next/server";
import prisma from '@/lib/db'
import { getToken } from "next-auth/jwt";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ classroomId: string, meetingId: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const { classroomId, meetingId } = await params;
        const classId = Number(classroomId);
        const meetId = Number(meetingId);
        if (isNaN(classId) || isNaN(meetId)) {
            return NextResponse.json({ message: "Invalid IDs" }, { status: 400 })
        }
        const data = await req.json();
        if (!data || (data.action !== "start" && data.action !== "end")) {
            return NextResponse.json({ message: "Action must be 'start' or 'end'" }, { status: 400 })
        }

        const classroom = await prisma.classroom.findUnique({
            where: {
                id: classId
            },
            select: {
                teacherId: true
            }
        })
        if (!classroom || classroom.teacherId !== Number(token.id)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
        }
        const meeting = await prisma.meeting.findUnique({ where: { id: meetId } })
        if (!meeting || meeting.classroomId !== classId) {
            return NextResponse.json({ message: "Meeting not found in this classroom" }, { status: 404 })
        }

        if (data.action === "start") {
            if (meeting.status !== "SCHEDULED") {
                return NextResponse.json({ message: "Meeting cannot be started" }, { status: 400 })
            }
            if (new Date() < new Date(meeting.scheduled_at)) {
                return NextResponse.json({
                    message: `This meeting is scheduled for ${new Date(meeting.scheduled_at).toLocaleString()}. You can't start it before then.`
                }, { status: 400 })
            }
            const updated = await prisma.meeting.update({
                where: { id: meetId },
                data: { status: "LIVE", started_at: new Date() }
            })
            return NextResponse.json({ meeting: updated }, { status: 200 })
        } else {
            if (meeting.status !== "LIVE") {
                return NextResponse.json({ message: "Meeting cannot be ended" }, { status: 400 })
            }
            const updated = await prisma.meeting.update({
                where: {
                    id: meetId
                },
                data: {
                    status: "ENDED",
                    ended_at: new Date()
                }
            })
            return NextResponse.json({ meeting: updated }, { status: 200 })
        }

    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }

}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ classroomId: string, meetingId: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const { classroomId, meetingId } = await params;
        const classId = Number(classroomId);
        const meetId = Number(meetingId);
        if (isNaN(classId) || isNaN(meetId)) {
            return NextResponse.json({ message: "Invalid IDs" }, { status: 400 })
        }

        const classroom = await prisma.classroom.findUnique({
            where: { id: classId },
            select: { teacherId: true }
        })
        if (!classroom || classroom.teacherId !== Number(token.id)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
        }

        const meeting = await prisma.meeting.findUnique({ where: { id: meetId } })
        if (!meeting || meeting.classroomId !== classId) {
            return NextResponse.json({ message: "Meeting not found in this classroom" }, { status: 404 })
        }

        if (meeting.status === "LIVE") {
            return NextResponse.json({ message: "End the meeting before deleting it" }, { status: 400 })
        }

        await prisma.meeting.delete({ where: { id: meetId } })

        return NextResponse.json({ message: "Meeting deleted successfully" }, { status: 200 })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}