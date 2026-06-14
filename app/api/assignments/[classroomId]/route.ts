import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest, { params }) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const { id } = await params;
        const classroomId = Number(id)
        const existing = await prisma.classroom.findUnique({ where: { id: classroomId } })
        if (!existing) {
            return NextResponse.json({ message: "classroom not found" }, { status: 404 })
        }
        const teacherId = existing.teacherId
        const studentId = await prisma.classroomStudent.findUnique({
            where: {
                userId_classroomId: {
                    userId: Number(token.id),
                    classroomId: classroomId
                }
            }
        })
        if(teacherId!=Number(token.id) && !studentId){
            return NextResponse.json({message:"Unauthorized"},{status:403})
        }
        const assignments = await prisma.assignment.findMany({ where: { classId: classroomId } })
        return NextResponse.json({ assignments }, { status: 200 })

    } catch (err) {
        console.log(err);
        return NextResponse.json({ messgae: "Internal Error" }, { status: 500 })
    }
}
