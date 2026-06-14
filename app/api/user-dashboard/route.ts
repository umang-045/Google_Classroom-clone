import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";


export async function GET(req: NextRequest) {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    console.log("TOKEN:", token)
    if (!token || !token.id) {
        return NextResponse.json({ message: "Login and Try again" }, { status: 400 })
    }
    const userId = Number(token.id)
    try {
        const data = await prisma.users.findUnique({
            where: { id: userId },
            include: {
                teachingClassrooms: {
                    include: {
                        students: true,
                        assignments: {
                            include: { submissions: true },
                        },
                    },

                },
                enrolledClassrooms: {
                    include: {
                        classroom: {
                            include: {
                                teacher: true,
                                assignments: {
                                    include: { submissions: true },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!data) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ data }, { status: 200 })

    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }
}
