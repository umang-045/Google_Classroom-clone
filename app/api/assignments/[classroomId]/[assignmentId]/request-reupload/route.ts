import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";

interface RequestProp {
    reason: string;
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ classroomId: string; assignmentId: string }> }
) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try again" }, { status: 401 });
    }

    try {
        const { classroomId: rawClassroomId, assignmentId: rawAssignmentId } = await params;

        const assignmentId = Number(rawAssignmentId);
        const classroomId = Number(rawClassroomId);

        if (isNaN(assignmentId) || isNaN(classroomId)) {
            return NextResponse.json({ message: "Invalid route parameters" }, { status: 400 });
        }

        const data: RequestProp = await req.json();
        if (!data || !data.reason || !data.reason.trim()) {
            return NextResponse.json({ message: "Please provide a reason for requesting a re-upload" }, { status: 400 });
        }

        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId }
        });

        if (!assignment) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
        }

        const existingSubmission = await prisma.submission.findUnique({
            where: {
                studentId_assignmentId: {
                    studentId: Number(token.id),
                    assignmentId: assignmentId,
                }
            }
        });

        const isPastDeadline = new Date() > new Date(assignment.due_at);
        const hasSubmitted = !!existingSubmission;

        if (!isPastDeadline && !hasSubmitted) {
            return NextResponse.json({ message: "Deadline has not passed and you haven't submitted yet. You can submit directly without a request." }, { status: 400 });
        }

        // Block a new request while a previous one is still awaiting the teacher's decision
        const existingRequest = await prisma.reuploadRequest.findUnique({
            where: {
                studentId_assignmentId: {
                    studentId: Number(token.id),
                    assignmentId: assignmentId,
                }
            }
        });

        if (existingRequest && existingRequest.status === "PENDING") {
            return NextResponse.json(
                { message: "You already have a pending request awaiting the teacher's review." },
                { status: 400 }
            );
        }

        const requestRecord = await prisma.reuploadRequest.upsert({
            where: {
                studentId_assignmentId: {
                    studentId: Number(token.id),
                    assignmentId: assignmentId,
                }
            },
            update: {
                reason: data.reason,
                status: "PENDING",
                teacherNote: null,
                extended_deadline: null,
                created_at: new Date(),
            },
            create: {
                studentId: Number(token.id),
                assignmentId: assignmentId,
                reason: data.reason,
                status: "PENDING",
            }
        });

        return NextResponse.json({ message: "Re-upload request sent to teacher successfully", requestRecord }, { status: 201 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}