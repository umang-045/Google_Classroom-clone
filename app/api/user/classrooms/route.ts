import {prisma} from '../../../../lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

async function UserClassroom(req:NextRequest){
    try{
        const token = await getToken({req:req,secret:process.env.NEXTAUTH_SECRET})
        if(!token || !token.id){
            return NextResponse.json({message:"Login and Try Again"},{status:401})
        }
        const userId=parseInt(token.id as string);
        const teachingClassroom=await prisma.classroom.findMany({
            where:{
                teacherId:userId
            }
        })
        const enrolledClassroom=await prisma.classroomStudent.findMany({
            where:{userId},
            include:{classroom:true}
        })

        return NextResponse.json({teachingClassroom,enrolledClassroom},{status:200})

    }catch(err){
        console.error(err)
        return NextResponse.json({message:"Internal Error "},{status:500})
    }
}

export {UserClassroom as GET}