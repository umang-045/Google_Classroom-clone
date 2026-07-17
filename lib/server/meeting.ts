import prisma from '@/lib/db'

export async function getMeetingsForClassroom(classId: number, userId: number) {
    const classroom = await prisma.classroom.findUnique({
        where: { id: classId },
        select: { teacherId: true }
    })

    if (!classroom) {
        throw new Error("CLASSROOM_NOT_FOUND")
    }

    const isStudent = await prisma.classroomStudent.findUnique({
        where: {
            userId_classroomId: {
                userId: userId,
                classroomId: classId
            }
        }
    })

    if (classroom.teacherId !== userId && !isStudent) {
        throw new Error("UNAUTHORIZED")
    }

    const meetingData = await prisma.meeting.findMany({
        where: {
            classroomId: classId,
        },
        orderBy: {
            scheduled_at: 'desc'
        }
    })

    return { meetings: meetingData }
}