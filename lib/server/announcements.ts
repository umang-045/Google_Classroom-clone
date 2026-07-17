import prisma from "@/lib/db"

export async function getAnnouncementsForClassroom(classId: number, userId: number) {
    const existing = await prisma.classroom.findUnique({ where: { id: classId } })
    if (!existing) {
        throw new Error("CLASSROOM_NOT_FOUND")
    }

    const teacherId = existing.teacherId

    const studentId = await prisma.classroomStudent.findUnique({
        where: {
            userId_classroomId: {
                userId: userId,
                classroomId: classId
            }
        }
    })
    if (teacherId != userId && !studentId) {
        throw new Error("UNAUTHORIZED")
    }

    const allAnnouncement = await prisma.announcement.findMany({
        where: {
            classroomId: classId,
        },
        orderBy: {
            created_at: 'desc'
        }
    })
    return { allAnnouncement }
}