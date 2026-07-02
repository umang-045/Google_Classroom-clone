import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ classroomId: string }> }) {
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

        const classroom = await prisma.classroom.findUnique({
            where: {
                id: Number(classroomId)
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

        const allquizInfo = await prisma.quiz.findMany({
            where: {
                classroomId: classId,
            },
            select:{
                id:true,
                title:true,
                description:true,
                created_at:true,
            }
        })
        return NextResponse.json({ allquizInfo }, { status: 200 })

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}