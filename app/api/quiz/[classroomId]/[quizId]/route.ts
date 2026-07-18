import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/db";
import { getQuizDetail } from "@/lib/server/quiz";

export async function GET(req: NextRequest, { params }: { params: Promise<{ classroomId: string, quizId: string }> }) {
    try {
        const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
        if (!token || !token.id) {
            return NextResponse.json({ message: "Unauthorized, please login again" }, { status: 401 });
        }
        const data = await params;
        const classId = Number(data.classroomId)
        const quizId = Number(data.quizId)

        if (isNaN(classId)) {
            return NextResponse.json({ message: "Invalid Classroom" }, { status: 401 });
        }
        if (isNaN(quizId)) {
            return NextResponse.json({ message: "Invalid Quiz" }, { status: 400 });
        }

        const { quizDetail, submission } = await getQuizDetail(classId, quizId, Number(token.id))
        return NextResponse.json({ quizDetail, submission }, { status: 200 });

    } catch (err) {
        if (err instanceof Error && err.message === "CLASSROOM_NOT_FOUND") {
            return NextResponse.json({ message: "Classroom not found" }, { status: 404 });
        }
        if (err instanceof Error && err.message === "NOT_ENROLLED") {
            return NextResponse.json({ message: "You are not enrolled in this classroom" }, { status: 403 });
        }
        if (err instanceof Error && err.message === "QUIZ_NOT_FOUND") {
            return NextResponse.json({ message: "Quiz not found in this classroom" }, { status: 404 });
        }
        console.log(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ classroomId: string, quizId: string }> }) {
    try {
        const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
        if (!token || !token.id) {
            return NextResponse.json({ message: "Unauthorized, please login again" }, { status: 401 });
        }
        const paramsdata = await params;
        const classId = Number(paramsdata.classroomId)
        const quizId = Number(paramsdata.quizId)

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
            return NextResponse.json({ message: "Only the teacher can delete this quiz" }, { status: 403 });
        }

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId }
        });
        if (!quiz || quiz.classroomId !== classId) {
            return NextResponse.json({ message: "Quiz not found in this classroom" }, { status: 404 });
        }

        await prisma.quiz.delete({
            where: { id: quizId }
        });

        return NextResponse.json({ message: "Quiz deleted" }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}