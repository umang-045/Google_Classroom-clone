import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/db";

interface QuestionInput {
    id: string;
    question: string;
    marks: number;
}

interface dataProp {
    title: string;
    description: string;
    questions: QuestionInput[];
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ classroomId: string }> }) {
    try {
        const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
        if (!token || !token.id) {
            return NextResponse.json({ message: "Unauthorized, please login again" }, { status: 401 });
        }
        const { classroomId } = await params;
        const classId = Number(classroomId)

        if (isNaN(classId)) {
            return NextResponse.json({ message: "Invalid Classroom" }, { status: 401 });
        }

        const teacherClassroom = await prisma.classroom.findUnique({
            where: {
                id: Number(classroomId)
            },
            select: {
                teacherId: true
            }
        })

        if (!teacherClassroom || teacherClassroom.teacherId !== Number(token.id)) {
            return NextResponse.json({ message: "You are not authorized to create the quiz" }, { status: 403 })
        }

        const data: dataProp = await req.json()
        if (!data || !data.title?.trim()  || data.questions.length === 0) {
            return NextResponse.json({ message: "Provide complete details" }, { status: 400 })
        }
        await prisma.quiz.create({
            data: {
                title: data.title,
                description: data.description,
                questions: data.questions as any,
                classroomId: classId,
                teacherId: Number(token.id),
            }
        })
        return NextResponse.json({ message: "Created Quiz Successfully" }, { status: 201 })

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}