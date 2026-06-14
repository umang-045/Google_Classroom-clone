import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";

interface dataProp {
    fileUrl: string,
    assignmentId: number,
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ classroomId: string }> }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const { classroomId } = await params;
        const id = Number(classroomId)
        const data: dataProp = await req.json();

        const existing = await prisma.classroom.findUnique({ where: { id: id } })
        if (!existing) {
            return NextResponse.json({ message: "classroom not found" }, { status: 404 })
        }
        const studentId = await prisma.classroomStudent.findUnique({
            where: {
                userId_classroomId: {
                    userId: Number(token.id),
                    classroomId: id
                }
            }
        })
        if (!studentId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
        }
        const alreadySubmitted = await prisma.submission.findUnique({
            where: {
                studentId_assignmentId: {
                    studentId: Number(token.id),
                    assignmentId: data.assignmentId
                }
            }
        })
        if(alreadySubmitted){
           return NextResponse.json({ message: "Already Submitted" }, { status: 400 })
        }
        await prisma.submission.create({
            data: {
                fileUrl: data.fileUrl,
                assignmentId: data.assignmentId,
                studentId: Number(token.id)
            }
        })
        return NextResponse.json({ message: "Submitted" }, { status: 200 })

    } catch (err) {
        console.log(err);
        return NextResponse.json({ messgae: "Internal Error" }, { status: 500 })
    }
}