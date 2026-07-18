import prisma from "@/lib/db";

export async function getClassroomChatData(classroomIdStr: string, userIdStr: string) {
    const classroomId = Number(classroomIdStr);
    const userId = Number(userIdStr);

    const [isMember, classroom] = await Promise.all([
        prisma.classroomStudent.findUnique({
            where: { userId_classroomId: { userId, classroomId } }
        }),
        prisma.classroom.findUnique({
            where: { id: classroomId }
        })
    ]);

    if (!isMember && classroom?.teacherId !== userId) {
        throw new Error("FORBIDDEN");
    }

    const [allmessages, currentUser] = await Promise.all([
        prisma.chat.findMany({
            where: {
                classId: classroomId
            },
            select: {
                id: true,
                created_at: true,
                message: true,
                sender: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                }
            },
            orderBy: { created_at: 'desc' },
            take: 50
        }),
        prisma.users.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, image: true }
        }
    )]);

    if (!currentUser) {
        throw new Error("NOT_FOUND");
    }

    return { messages: allmessages, currentUser };
}