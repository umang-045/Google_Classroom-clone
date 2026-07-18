import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/db";
import { getClassroomChatData } from "@/lib/server/chat";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 401 })
    }
    try {
        const { message } = await req.json();
        if (!message || message.trim() === "") {
            return NextResponse.json({ message: "Message cannot be empty" }, { status: 400 })
        }
        const classId = (await params).id
        const classroomId = Number(classId)
        const userId = Number(token.id)

        const [isMember, classroom] = await Promise.all([
            prisma.classroomStudent.findUnique({
                where: { userId_classroomId: { userId, classroomId } }
            }),
            prisma.classroom.findUnique({
                where: { id: classroomId }
            })
        ]);
        
        if (!isMember && classroom?.teacherId !== userId) {
            return NextResponse.json({ message: "Not a member" }, { status: 403 })
        }
        const saved = await prisma.chat.create({
            data: { message: message.trim(), senderId: userId, classId: classroomId },
            include: { sender: { select: { name: true, email: true } } }
        })
        return NextResponse.json(saved, { status: 201 })

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 401 })
    }
    try {
        const classId = (await params).id
        const userId = String(token.id)
        
        const data = await getClassroomChatData(classId, userId);
        return NextResponse.json(data, { status: 200 })

    } catch (err: any) {
        console.log(err);
        if (err.message === "FORBIDDEN") {
            return NextResponse.json({ message: "Not a member" }, { status: 403 })
        }
        if (err.message === "NOT_FOUND") {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }
}