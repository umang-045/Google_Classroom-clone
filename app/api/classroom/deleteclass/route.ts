import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../../lib/db";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const { classroomId } = await req.json();
    
    if (!classroomId) {
      return NextResponse.json({ message: "Classroom ID is required" }, { status: 400 });
    }
    
    const classroomid = Number(classroomId);

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
      return NextResponse.json({ message: "Unauthorized, please login again" }, { status: 401 });
    }
    const userId = Number(token.id);

    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomid },
      select: { teacherId: true }
    });

    if (!classroom) {
      return NextResponse.json({ message: "Classroom not found" }, { status: 404 });
    }

    if (userId !== classroom.teacherId) {
      return NextResponse.json({ message: "Forbidden: You are not the teacher" }, { status: 403 });
    }
    
    await prisma.classroom.delete({ where: { id: classroomid } });

    return NextResponse.json({ message: "Classroom deleted" }, { status: 200 });

  } catch (error) {
    console.error("Delete classroom error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}