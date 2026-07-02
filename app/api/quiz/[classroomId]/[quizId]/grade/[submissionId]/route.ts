import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/db";

interface GradedAnswer {
    questionId: string;
    answer: string;
    marks: number;
    feedback?: string;
}
interface GradeBody {
    answers: GradedAnswer[];
    totalMarks: number;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ classroomId: string, quizId: string, submissionId: string }> }) {
    try {
        const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
        if (!token || !token.id) {
            return NextResponse.json({ message: "Unauthorized, please login again" }, { status: 401 });
        }
        const paramsdata = await params;
        const classId = Number(paramsdata.classroomId)
        const quizId = Number(paramsdata.quizId)
        const submissionId = Number(paramsdata.submissionId)

        if (isNaN(classId)) {
            return NextResponse.json({ message: "Invalid Classroom" }, { status: 401 });
        }
        if (isNaN(quizId)) {
            return NextResponse.json({ message: "Invalid Quiz" }, { status: 400 });
        }
        if (isNaN(submissionId)) {
            return NextResponse.json({ message: "Invalid Submission" }, { status: 400 });
        }

        const classroom = await prisma.classroom.findUnique({
            where: {
                id: classId
            },
            select: {
                teacherId: true,
            }
        })
        if (!classroom) {
            return NextResponse.json({ message: "Classroom not found" }, { status: 404 });
        }
        if (classroom.teacherId !== Number(token.id)) {
            return NextResponse.json({ message: "Only teachers can grade students" }, { status: 403 })
        }
        const submission = await prisma.quizSubmission.findUnique({
            where: {
                id: submissionId
            }
        })

        if (!submission || submission.quizId !== quizId) {
            return NextResponse.json({ message: "Submission not found" }, { status: 404 });
        }

        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            }
        })
        if (!quiz || quiz.classroomId !== classId) {
            return NextResponse.json({ message: "Quiz not found in this classroom" }, { status: 404 });
        }
        const data: GradeBody = await req.json()
        if (!data || data.answers.length == 0) {
            return NextResponse.json({ message: "Provide your answers" }, { status: 400 })
        }
        await prisma.quizSubmission.update({
            where: {
                id: submissionId
            },
            data: {
                answers: data.answers as any,
                marks: data.totalMarks,
                status: "GRADED"
            }
        });
        return NextResponse.json({ message: "Quiz Graded Successfully" }, { status: 200 })

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}