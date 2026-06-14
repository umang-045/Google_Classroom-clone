import { NextResponse,NextRequest } from "next/server";
import prisma from "../../../../lib/db";
import { getToken } from "next-auth/jwt";

async function createClass(req:NextRequest){
    try{
        const {className,semester,section,description} = await req.json()
        if(!className || !semester || !section){
            return NextResponse.json({message:"All Fields Are Required"},{status:400})
        }
        const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || !token.id) {
            return NextResponse.json({ message: "Unauthorized, please login again" }, { status: 401 });
        }
        const joinCode=Math.random().toString(36).substring(2,10);
        await prisma.classroom.create({data:{className:className,semester:semester,section:section,description:description ||" ",joinCode:joinCode,teacher:{connect:{id:parseInt(token.id as string)}}}})
        return NextResponse.json({message:"Classroom Created Successfully"},{status:201})
    }catch(err){
        console.error("Create class error:", err)
        return NextResponse.json({message:"Internal Error,Try again later"},{status:500})
    }

}
export {createClass as POST}

