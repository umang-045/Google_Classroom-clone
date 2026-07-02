import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/db";

interface AnswerInput {
    questionId: string;
    answer: string;
}

interface dataProp {
    answers: AnswerInput[];
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ classroomId: string, quizid: string }> }) {
    try {
        const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
        if (!token || !token.id) {
            return NextResponse.json({ message: "Unauthorized, please login again" }, { status: 401 });
        }
        const paramsdata = await params;
        const classId = Number(paramsdata.classroomId)
        const quizId = Number(paramsdata.quizid)

        if (isNaN(classId)) {
            return NextResponse.json({ message: "Invalid Classroom" }, { status: 401 });
        }
        if (isNaN(quizId)) {
            return NextResponse.json({ message: "Invalid Quiz" }, { status: 400 });
        }

        const classroom = await prisma.classroom.findUnique({
            where: {
                id: classId
            },
            select: {
                teacherId: true,
                students: {
                    where: {
                        userId: Number(token.id)
                    }
                }
            }
        })
        if (!classroom) {
            return NextResponse.json({ message: "Classroom not found" }, { status: 404 });
        }
        if (classroom.teacherId === Number(token.id)) {
            return NextResponse.json({ message: "Teacher Cannot Submit Quiz" }, { status: 403 })
        }
        if (classroom.students.length === 0) {
            return NextResponse.json({ message: "Please Enroll in the class" }, { status: 403 });
        }

        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            }
        })
        if (!quiz || quiz.classroomId !== classId) {
            return NextResponse.json({ message: "Quiz not found in this classroom" }, { status: 404 });
        }
        const data: dataProp = await req.json()
        if (!data || data.answers.length == 0) {
            return NextResponse.json({ message: "Provide your answers" }, { status: 400 })
        }

        await prisma.quizSubmission.create({
            data: {
                quizId: quizId,
                studentId: Number(token.id),
                answers: data.answers as any,
            }
        });
        return NextResponse.json({ message: " Quiz Submitted Successfully" }, { status: 201 })

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ classroomId: string, quizid: string }> }) {
    try {
        const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
        if (!token || !token.id) {
            return NextResponse.json({ message: "Unauthorized, please login again" }, { status: 401 });
        }
        const paramsdata = await params;
        const classId = Number(paramsdata.classroomId)
        const quizId = Number(paramsdata.quizid)
        if (isNaN(classId)) {
            return NextResponse.json({ message: "Invalid Classroom" }, { status: 401 });
        }
        if (isNaN(quizId)) {
            return NextResponse.json({ message: "Invalid Quiz" }, { status: 400 });
        }
        const classroom = await prisma.classroom.findUnique({
            where: { id: classId },
            select: { teacherId: true }
        });
        if (!classroom) {
            return NextResponse.json({ message: "Classroom not found" }, { status: 404 });
        }
        if (classroom.teacherId !== Number(token.id)) {
            return NextResponse.json({ message: "Only the teacher can view submissions" }, { status: 403 });
        }
        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId }
        });
        if (!quiz || quiz.classroomId !== classId) {
            return NextResponse.json({ message: "Quiz not found in this classroom" }, { status: 404 });
        }
        const submissions = await prisma.quizSubmission.findMany({
            where: { quizId },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        });

        return NextResponse.json({ submissions }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}