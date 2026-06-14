import { NextResponse } from "next/server"
import prisma from "../../../lib/db"
import { generateOTP,sendOTPEmail } from "../../../lib/otp"

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        const user = await prisma.users.findUnique({ where: { email } })
        if (!user) {
            return NextResponse.json({ error: "No account found with this email" }, { status: 400 })
        }

        const otp = generateOTP();
        const expires_at = new Date(Date.now() + 10 * 60 * 1000)

        await prisma.verificationTable.upsert({
            where: { email },
            update: { otp, expires_at },
            create: { email, name: user.name, password: "", otp, expires_at },
        })

        await sendOTPEmail(email, otp)

        return NextResponse.json({ message: "OTP sent" }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: "Internal Error, Try Again" }, { status: 500 })
    }
}