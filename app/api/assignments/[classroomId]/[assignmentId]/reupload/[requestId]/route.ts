import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";

interface ReviewProp {
    status: "APPROVED" | "REJECTED";
    teacherNote?: string;
    extended_deadline?: string;
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ classroomId: string; assignmentId: string; requestId: string }> }
) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try again" }, { status: 401 });
    }

    try {
        const resolvedParams = await params;
        const classroomId = Number(resolvedParams.classroomId);
        const assignmentId = Number(resolvedParams.assignmentId);
        const requestId = Number(resolvedParams.requestId);

        if (isNaN(classroomId) || isNaN(requestId) || isNaN(assignmentId)) {
            return NextResponse.json({ message: "Invalid route parameters" }, { status: 400 });
        }

        const classroomData = await prisma.classroom.findUnique({
            where: { id: classroomId },
            select: { teacherId: true }
        });

        if (!classroomData) {
            return NextResponse.json({ message: "Classroom not found" }, { status: 404 });
        }

        if (Number(token.id) !== Number(classroomData.teacherId)) {
            return NextResponse.json({ message: "Only Teachers can approve/reject re-upload requests" }, { status: 403 });
        }

        const data: ReviewProp = await req.json();

        if (!data || !["APPROVED", "REJECTED"].includes(data.status)) {
            return NextResponse.json({ message: "Invalid status provided" }, { status: 400 });
        }

        let extendedDeadlineDate: Date | null = null;
        if (data.status === "APPROVED" && data.extended_deadline) {
            extendedDeadlineDate = new Date(data.extended_deadline);
            if (isNaN(extendedDeadlineDate.getTime())) {
                return NextResponse.json({ message: "Invalid extended deadline date format" }, { status: 400 });
            }
        }

        const updatedRequest = await prisma.reuploadRequest.update({
            where: { id: requestId },
            data: {
                status: data.status,
                teacherNote: data.teacherNote || null,
                extended_deadline: extendedDeadlineDate,
            }
        });

        if (data.status === "APPROVED") {
            await prisma.submission.deleteMany({
                where: {
                    studentId: updatedRequest.studentId,
                    assignmentId: assignmentId,
                }
            });
        }

        await prisma.notification.create({
            data: {
                userId: updatedRequest.studentId,
                classroomId: classroomId,
                title: `Re-upload Request ${data.status === "APPROVED" ? "Approved" : "Rejected"}`,
                message: data.status === "APPROVED" 
                    ? `Your request to re-upload your assignment has been approved.`
                    : `Your request for re-upload was rejected by the teacher.`,
                type: "ASSIGNMENT",
                isRead: false,
            }
        });

        return NextResponse.json({ 
            message: `Request ${data.status.toLowerCase()} successfully`, 
            updatedRequest 
        }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}