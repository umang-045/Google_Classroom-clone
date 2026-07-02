import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/db";

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
        const isTeacher = classroom.teacherId === Number(token.id);
        const isStudent = classroom.students.length > 0;

        if (!isTeacher && !isStudent) {
            return NextResponse.json({ message: "You are not enrolled in this classroom" }, { status: 403 });
        }

        const quizDetail = await prisma.quiz.findUnique({
            where: {
                id: quizId,
            },
        })
        if (!quizDetail || quizDetail.classroomId !== classId) {
            return NextResponse.json({ message: "Quiz not found in this classroom" }, { status: 404 });
        }
        const submission = await prisma.quizSubmission.findUnique({
            where: {
                quizId_studentId: {
                    quizId: quizId,
                    studentId: Number(token.id)
                }
            }
        });


        return NextResponse.json({ quizDetail, submission }, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}