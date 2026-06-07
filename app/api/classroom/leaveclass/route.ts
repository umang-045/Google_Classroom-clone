import { NextResponse, NextRequest } from "next/server";
import prisma from '../../../../lib/db'
import { getToken } from "next-auth/jwt";

async function LeaveClass(req: NextRequest) {
    const { classroomId } = await req.json();
    const classroomid = Number(classroomId);
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Unauthorized, please login again" }, { status: 401 });
    }
    const userId = Number(token.id);
    await prisma.classroomStudent.delete({where:{userId_classroomId:{userId:userId,classroomId:classroomid}}})
     return NextResponse.json({ message: "Classroom left" }, { status: 200 })

}
export { LeaveClass as POST }