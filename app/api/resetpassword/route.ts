import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import  prisma  from "@/lib/db" 

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters." },
                { status: 400 }
            )
        }

        const user = await prisma.users.findUnique({ where: { email } })

        if (!user) {
            return NextResponse.json(
                { error: "No account found with this email." },
                { status: 404 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.users.update({
            where: { email },
            data: { password: hashedPassword },
        })

        return NextResponse.json(
            { message: "Password reset successfully." },
            { status: 200 }
        )

    } catch (err) {
        console.error("Reset password error:", err)
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        )
    }
}