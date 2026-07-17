import prisma from "@/lib/db"

export interface classroomProp {
    id: number;
    teacherId: number;
    className: string;
    joinCode: string;
    semester: string;
    section: string;
    teacher: {
        name: string;
        email: string;
        image: string | null;
    };
    students: {
        user: {
            name: string;
            email: string;
            image: string | null;
        };
    }[];
}

export async function getClassroomDetails(classroomId: number, userId: number) {
    const classroom: classroomProp | null = await prisma.classroom.findUnique({ where: { id: classroomId }, include: { teacher: { select: { name: true, email: true, image: true } }, students: { select: { user: { select: { name: true, email: true, image: true } } } } } })

    if (!classroom) {
        throw new Error("CLASSROOM_NOT_FOUND")
    }
    const isTeacher = classroom.teacherId === userId
    const isStudent = await prisma.classroomStudent.findUnique({ where: { userId_classroomId: { userId: userId, classroomId: classroomId } } })
    if (!isTeacher && !isStudent) {
        throw new Error("NOT_ENROLLED")
    }

    return { classroom, role: isTeacher ? "teacher" : "student" }
}

export async function getClassroomRequests(classroomId: number, userId: number) {
    const classroom = await prisma.classroom.findUnique({ where: { id: classroomId } })
    if (!classroom) {
        throw new Error("CLASSROOM_NOT_FOUND")
    }
    if (classroom.teacherId !== userId) {
        throw new Error("UNAUTHORIZED")
    }

    const requests = await prisma.joinRequest.findMany({
        where: { classroomId: classroomId },
        include: {
            user: {
                select: { name: true, email: true }
            }
        },
        orderBy: { requested_at: 'desc' }
    })

    return { requests }
}

export async function getClassroomRole(classroomId: number, userId: number) {
    const classroom = await prisma.classroom.findUnique({ where: { id: classroomId }, select: { teacherId: true } })

    if (!classroom) {
        throw new Error("CLASSROOM_NOT_FOUND")
    }

    const isTeacher = classroom.teacherId === userId
    const isStudent = await prisma.classroomStudent.findUnique({ where: { userId_classroomId: { userId: userId, classroomId: classroomId } } })
    if (!isTeacher && !isStudent) {
        throw new Error("NOT_ENROLLED")
    }

    return { role: isTeacher ? "teacher" : "student" }
}