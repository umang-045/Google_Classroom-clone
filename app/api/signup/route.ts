import { NextResponse } from "next/server"
import  prisma  from "../../../lib/db"
import bcrypt from "bcryptjs"
import { generateOTP,sendOTPEmail } from "../../../lib/otp"

async function signupHandler(req:Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const existing = await prisma.users.findUnique({where:{email:email},select:{id:true}})
    if (existing!=null) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      )
    }

    const hashedPassword : string = await bcrypt.hash(password, 12)
    const OTP=generateOTP();
    const expires_at=new Date(Date.now()+600000);
    
    await prisma.verificationTable.upsert({
      where: { email },
      update: { otp:OTP, expires_at, password: hashedPassword },
      create: { email, otp:OTP, expires_at, name, password: hashedPassword }
    })

    await sendOTPEmail(email, OTP);

    return NextResponse.json(
      { message:"OTP SENT SUCCESSFULLY" },
      { status: 201 }
    )

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


export { signupHandler as POST }