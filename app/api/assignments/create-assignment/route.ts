import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { sendNotificationToClass } from "@/lib/sendNotification";

interface dataProp {
    title: string,
    description: string
    fileUrl?: string
    classroomId: number
    due_at: string
}

export async function POST(req: NextRequest) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try again" }, { status: 400 })
    }
    try {
        const data: dataProp = await req.json();
        if (!data || !data.title || !data.description || !data.due_at || !data.classroomId) {
            return NextResponse.json({ message: "Fill up your details" }, { status: 400 })
        }

        const dueDate = new Date(data.due_at)
        if (isNaN(dueDate.getTime())) {
            return NextResponse.json({ message: "Invalid due date format" }, { status: 400 })
        }
        if (dueDate <= new Date()) {
            return NextResponse.json({ message: "Due date must be in the future" }, { status: 400 })
        }

        const classroomData = await prisma.classroom.findUnique({ where: { id: data.classroomId }, select: { teacherId: true } })
        if (!classroomData) {
            return NextResponse.json({ message: "classroom not found" }, { status: 404 })
        }
        if (Number(token.id) != Number(classroomData.teacherId)) {
            return NextResponse.json({ message: "Only Teachers Can Create Assignment" }, { status: 400 })
        }

        await prisma.assignment.create({
            data: {
                title: data.title,
                description: data.description,
                fileUrl: data.fileUrl,
                due_at: dueDate.toISOString(),
                teacherId: Number(classroomData.teacherId),
                classId: data.classroomId,
            }
        })

        
        await sendNotificationToClass({
            classroomId: Number(data.classroomId),
            title: "New Assignment",
            message: `A new assignment "${data.title}" has been posted.`,
            type: "ASSIGNMENT"
        });

        return NextResponse.json({ message: "Assignment Created Successfully" }, { status: 201 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }
}