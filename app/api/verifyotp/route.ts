import { NextResponse } from "next/server"
import { prisma } from "../../../lib/db"

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json()

        const info = await prisma.verificationTable.findUnique({ where: { email } })
        if (!info) {
            return NextResponse.json({ error: "Try Again Later" }, { status: 400 })
        }
        if (new Date() > info.expires_at) {
            await prisma.verificationTable.delete({ where: { email } })
            return NextResponse.json({ error: "OTP expired, please register again" }, { status: 400 })
        }
        if (info.otp !== otp) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
        }
        await prisma.users.create({ data: { name: info.name, email: info.email, password: info.password } })
        await prisma.verificationTable.delete({ where: { email } })
        return NextResponse.json({ message: "Email verified successfully!" }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: "Internal Error, Try Again" }, { status: 500 })
    }
} 
