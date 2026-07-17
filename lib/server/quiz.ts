import prisma from "@/lib/db"

export async function getQuizzesForClassroom(classId: number, userId: number) {
    const classroom = await prisma.classroom.findUnique({
        where: {
            id: classId
        },
        select: {
            teacherId: true,
            students: {
                where: {
                    userId: userId
                }
            }
        }
    })
    if (!classroom) {
        throw new Error("CLASSROOM_NOT_FOUND")
    }
    const isTeacher = classroom.teacherId === userId;
    const isStudent = classroom.students.length > 0;

    if (!isTeacher && !isStudent) {
        throw new Error("NOT_ENROLLED")
    }

    const allquizInfo = await prisma.quiz.findMany({
        where: {
            classroomId: classId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            created_at: true,
        }
    })
    return { allquizInfo }
}