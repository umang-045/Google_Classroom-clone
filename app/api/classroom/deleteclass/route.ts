import { NextResponse,NextRequest } from "next/server";
import prisma from "../../../../lib/db";
import { getToken } from "next-auth/jwt";

async function deleteClass(req:NextRequest){
    const {classroomId} =await req.json();
    const classroomid=Number(classroomId)
    
    const token = await getToken({req:req,secret: process.env.NEXTAUTH_SECRET})
    if(!token || !token.id){
    return NextResponse.json({ message: "Unauthorized, please login again" }, { status: 401 });
    }
    const userId=Number(token.id);
    const teacherId=await prisma.classroom.findUnique({where:{id:classroomid},select:{teacherId:true}})
    if(userId!=teacherId?.teacherId){
        return NextResponse.json({message:"You are a Student"},{status:403})
    }
     await prisma.classroomStudent.deleteMany({where:{classroomId:classroomid}})
     await prisma.classroom.delete({where:{id:classroomid}})
     return NextResponse.json({ message: "Classroom deleted" }, { status: 200 })
}
export {deleteClass as POST}