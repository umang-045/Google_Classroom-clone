import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/db";
import { getToken } from "next-auth/jwt";


async function joinclass(req: NextRequest) {
    try {
        const { joinCode } = await req.json();
        if (!joinCode) {
            return NextResponse.json({ message: "Please Enter the Code" }, { status: 400 })
        }
        const existing = await prisma.classroom.findUnique({
            where: {
                joinCode: joinCode
            },
            select: {
                id: true,
                teacherId: true,
                className: true
            }
        })
        if (!existing) {
            return NextResponse.json({ message: "Invaild JoinCode " }, { status: 404 })
        }

        const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
        if (!token || !token.id) {
            return NextResponse.json({ message: "Unauthorized, please login again" }, { status: 401 });
        }
        if (existing.teacherId === parseInt(token.id as string)) {
            return NextResponse.json({ message: "You are the teacher of this class" }, { status: 400 })
        }
        const alreadyEnrolled = await prisma.classroomStudent.findUnique({ where: { userId_classroomId: { userId: parseInt(token.id as string), classroomId: existing.id } } })
        if (alreadyEnrolled) {
            return NextResponse.json({ message: "Already Enrolled !!" }, { status: 400 })
        }
        const alreadyRequested = await prisma.joinRequest.findUnique({ where: { userId_classroomId: { userId: parseInt(token.id as string), classroomId: existing.id } } })
        if (alreadyRequested) {
            return NextResponse.json({ message: "Already Requested !! Wait for Teacher Approval " }, { status: 400 })
        }
        await prisma.joinRequest.create({
            data: {
                user: {
                    connect:
                    {
                        id: parseInt(token.id as string)
                    }
                },
                classroom:
                {
                    connect:
                    {
                        id:
                            existing.id
                    }
                }
            }
        })
        await prisma.notification.create({
            data: {
                userId: existing.teacherId,
                classroomId: existing.id,
                title: "New Join Request",
                message: `${token.name || "A student"} requested to join your class "${existing.className}".`,
                type: "ANNOUNCEMENT",
                isRead: false
            }
        })
        const io = (global as any).io;
        if (io) {
            io.to(`user-channel-${existing.teacherId}`).emit("new-notification-alert");
        }
        return NextResponse.json({ message: "Join Request Created Successfully" }, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Internal Error, Try again later!" }, { status: 500 })
    }
}
export { joinclass as POST }