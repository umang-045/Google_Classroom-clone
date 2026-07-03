import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { AccessToken } from 'livekit-server-sdk';

export async function GET(req: NextRequest) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const room = req.nextUrl.searchParams.get('room');
        const username = req.nextUrl.searchParams.get('username');

        if (!room || !username) {
            return NextResponse.json({ message: "Missing room or username" }, { status: 400 });
        }

        const meetingId = Number(room.replace('meet-', ''));
        if (isNaN(meetingId)) {
            return NextResponse.json({ message: "Invalid room" }, { status: 400 });
        }

        const existing = await prisma.meeting.findUnique({ where: { id: meetingId } })
        if (!existing) {
            return NextResponse.json({ message: "meeting not found" }, { status: 404 })
        }

        const classId = existing.classroomId
        const classroom = await prisma.classroom.findUnique({ where: { id: classId } })
        if (!classroom) {
            return NextResponse.json({ message: "classroom not found" }, { status: 404 })
        }

        const teacherId = classroom.teacherId
        const studentId = await prisma.classroomStudent.findUnique({
            where: {
                userId_classroomId: {
                    userId: Number(token.id),
                    classroomId: classId
                }
            }
        })
        if (teacherId != Number(token.id) && !studentId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
        }

        const at = new AccessToken(
            process.env.LIVEKIT_API_KEY!,
            process.env.LIVEKIT_API_SECRET!,
            {
                identity: username,
                ttl: '2h',
            }
        );
        at.addGrant({
            roomJoin: true,
            room: room,
            canPublish: true,
            canSubscribe: true
        });

        return NextResponse.json({ token: await at.toJwt() });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }
}