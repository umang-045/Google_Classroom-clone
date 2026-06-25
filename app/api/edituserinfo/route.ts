import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";



export async function POST(req: NextRequest) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try Again" }, { status: 400 })
    }
    try {
        const data = await req.json();
        if (!data) {
            return NextResponse.json({ message: "Fill the details" }, { status: 400 })
        }
        await prisma.users.update({
            where: { id: Number(token.id) },
            data: {
                image: data.image
            }
        })
        return NextResponse.json({ message: "Image updated"}, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ messgae: "Internal Error" }, { status: 500 })
    }
}