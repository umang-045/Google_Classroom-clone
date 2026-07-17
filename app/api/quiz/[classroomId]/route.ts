import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getQuizzesForClassroom } from "@/lib/server/quiz";

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

        const { allquizInfo } = await getQuizzesForClassroom(classId, Number(token.id))
        return NextResponse.json({ allquizInfo }, { status: 200 })

    } catch (err) {
        if (err instanceof Error && err.message === "CLASSROOM_NOT_FOUND") {
            return NextResponse.json({ message: "Classroom not found" }, { status: 404 });
        }
        if (err instanceof Error && err.message === "NOT_ENROLLED") {
            return NextResponse.json({ message: "You are not enrolled in this classroom" }, { status: 403 });
        }
        console.log(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}