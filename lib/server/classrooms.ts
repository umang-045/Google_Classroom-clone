import prisma from '@/lib/db'

export async function getUserClassrooms(userId: number) {
    const teachingClassroom = await prisma.classroom.findMany({
        where: {
            teacherId: userId
        }
    })
    const enrolledClassroom = await prisma.classroomStudent.findMany({
        where: { userId },
        include: { classroom: true }
    })

    const pendingRequests = await prisma.joinRequest.findMany({
        where: { userId },
        include: { classroom: true }
    })

    return { teachingClassroom, enrolledClassroom, pendingRequests }
}