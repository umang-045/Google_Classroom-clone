import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json()
        const data = await prisma.verificationTable.findUnique({ where: { email } })
        if (!data) {
            return NextResponse.json({ error: "Try Again Later" }, { status: 400 })
        }
        if (new Date() > data.expires_at) {
            await prisma.verificationTable.delete({ where: { email } })
            return NextResponse.json({ error: "OTP expired" }, { status: 400 })
        }
        if (data.otp !== otp) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
        }
        return NextResponse.json({ message: "OTP verified" }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 })
    }
}