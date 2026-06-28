import { NextResponse, NextRequest } from "next/server";
import prisma from '@/lib/db'
import { getToken } from "next-auth/jwt";

interface dataProp {
    title: string;
    scheduled_at: string

}
export async function POST(req: NextRequest, { params }: { params: Promise<{ classroomId: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const { classroomId } = await params;
        const classId = Number(classroomId);
        if (isNaN(classId)) {
            return NextResponse.json({ message: "Invalid classroom ID" }, { status: 400 })
        }
        const data: dataProp = await req.json();
        if (!data || !data.title || !data.scheduled_at) {
            return NextResponse.json({ message: "Fill up the details" }, { status: 400 })
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
        await prisma.meeting.create({
            data: {
                title: data.title,
                scheduled_at: new Date(data.scheduled_at),
                classroomId: classId,
                teacherId: Number(token.id)
            }
        })
        return NextResponse.json({ message: "Created Meeting Successfully" }, { status: 201 })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }

}

export async function GET(req: NextRequest, { params }: { params: Promise<{ classroomId: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const { classroomId } = await params;
        const classId = Number(classroomId);
        if (isNaN(classId)) {
            return NextResponse.json({ message: "Invalid classroom ID" }, { status: 400 })
        }

        const classroom = await prisma.classroom.findUnique({
            where: { id: classId },
            select: { teacherId: true }
        })

        if (!classroom) {
            return NextResponse.json({ message: "Classroom not found" }, { status: 404 })
        }

        const isStudent = await prisma.classroomStudent.findUnique({
            where: {
                userId_classroomId: {
                    userId: Number(token.id),
                    classroomId: classId
                }
            }
        })

        if (classroom.teacherId !== Number(token.id) && !isStudent) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
        }

        const meetingData = await prisma.meeting.findMany({
            where: {
                classroomId: classId,
            }
        })
        return NextResponse.json({ meetings: meetingData }, { status: 200 })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }

}

