import prisma from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

async function UserProfile(req: NextRequest) {
  try {
    const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.id) {
      return NextResponse.json({ message: "Login and Try Again" }, { status: 401 })
    }
    const userId = parseInt(token.id as string)
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { name: true, email: true, image: true }
    })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ user }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Internal Error " }, { status: 500 })
  }
}
export { UserProfile as GET }