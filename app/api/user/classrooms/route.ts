import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { getUserClassrooms } from '@/lib/server/classrooms'

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
        if (!token || !token.id) {
            return NextResponse.json({ message: "Login and Try Again" }, { status: 401 })
        }
        const userId = parseInt(token.id as string)
        const { teachingClassroom, enrolledClassroom, pendingRequests } = await getUserClassrooms(userId)

        return NextResponse.json({ teachingClassroom, enrolledClassroom, pendingRequests }, { status: 200 })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Internal Error " }, { status: 500 })
    }
}