import prisma from "@/lib/db"

export async function getAssignmentsForClassroom(classroomId: number, userId: number) {
    const existing = await prisma.classroom.findUnique({ where: { id: classroomId } })
    if (!existing) {
        throw new Error("CLASSROOM_NOT_FOUND")
    }
    const teacherId = existing.teacherId
    const studentId = await prisma.classroomStudent.findUnique({
        where: {
            userId_classroomId: {
                userId: userId,
                classroomId: classroomId
            }
        }
    })
    if (teacherId != userId && !studentId) {
        throw new Error("UNAUTHORIZED")
    }
    const assignments = await prisma.assignment.findMany({
        where: { classId: classroomId },
        orderBy: {
            created_at: 'desc'
        }
    })

    const assignmentsWithStatus = await Promise.all(
        assignments.map(async (assignment) => {
            const submission = await prisma.submission.findFirst({
                where: {
                    assignmentId: assignment.id,
                    studentId: userId
                }
            })
            const approvedRequest = await prisma.reuploadRequest.findUnique({
                where: {
                    studentId_assignmentId: {
                        studentId: userId,
                        assignmentId: assignment.id
                    }
                }
            })

            const canReupload = !submission && approvedRequest?.status === "APPROVED"

            return {
                ...assignment,
                submitted: !!submission,
                marks: submission?.marks ?? null,
                feedback: submission?.feedback ?? null,
                submissionFileUrl: submission?.fileUrl ?? null,
                canReupload,
                reuploadDeadline: approvedRequest?.extended_deadline
                    ? approvedRequest.extended_deadline.toISOString()
                    : null
            }
        })
    )

    const role = teacherId === userId ? "teacher" : "student"

    return { assignments: assignmentsWithStatus, role }
}

export async function getSubmissionsForAssignment(classroomId: number, assignmentId: number, userId: number) {
    const classroom = await prisma.classroom.findUnique({
        where: {
            id: classroomId,
            teacherId: userId,
        },
    })

    if (!classroom) {
        throw new Error("FORBIDDEN")
    }

    const enrolledStudents = await prisma.classroomStudent.findMany({
        where: { classroomId },
        include: {
            user: {
                select: { id: true, name: true, email: true }
            }
        }
    })

    const submissions = await prisma.submission.findMany({
        where: { assignmentId },
    })

    const formatted = enrolledStudents.map((enrolled) => {
        const student = enrolled.user
        const submission = submissions.find((s) => s.studentId === student.id)

        return {
            id: submission?.id || `unsubmitted-${student.id}`,
            studentId: student.id,
            studentName: student.name || "Unknown Student",
            studentEmail: student.email || "",
            fileUrl: submission?.fileUrl || null,
            submittedAt: submission?.submitted_at || null,
            hasSubmitted: !!submission,
            marks: submission?.marks ?? null,
            feedback: submission?.feedback ?? null
        }
    })

    formatted.sort((a, b) => (b.hasSubmitted ? 1 : 0) - (a.hasSubmitted ? 1 : 0))

   
    const reuploadRequests = await prisma.reuploadRequest.findMany({
        where: {
            assignmentId,
            status: "PENDING",
        },
        include: {
            student: {
                select: { id: true, name: true, email: true, image: true }
            }
        },
        orderBy: { created_at: "desc" }
    })

    const requests = reuploadRequests.map((r) => ({
        id: r.id,
        studentId: r.student.id,
        studentName: r.student.name || "Unknown Student",
        studentEmail: r.student.email || "",
        studentImage: r.student.image ?? null,
        reason: r.reason,
        createdAt: r.created_at,
    }))

    return { submissions: formatted, requests }
}