import prisma from "@/lib/db"

export async function getClassroomAnalytics(classroomId: number, teacherId: number) {
    const classroom = await prisma.classroom.findUnique({ where: { id: classroomId } })
    if (!classroom) {
        throw new Error("CLASSROOM_NOT_FOUND")
    }
    if (classroom.teacherId !== teacherId) {
        throw new Error("UNAUTHORIZED")
    }

    const students = await prisma.classroomStudent.findMany({
        where: { classroomId },
        include: { user: { select: { id: true, name: true, email: true, image: true } } }
    })

    const assignments = await prisma.assignment.findMany({
        where: { classId: classroomId },
        include: { submissions: true },
        orderBy: { due_at: 'asc' }
    })

    const quizzes = await prisma.quiz.findMany({
        where: { classroomId },
        include: { submissions: true },
        orderBy: { created_at: 'asc' }
    })

    const quizSubmissions = quizzes.flatMap(q => q.submissions)

    const meetings = await prisma.meeting.findMany({
        where: { classroomId }
    })

    const totalAnnouncements = await prisma.announcement.count({
        where: { classroomId }
    })

    const totalAssignments = assignments.length
    const totalQuizzes = quizzes.length
    const totalMeetings = meetings.length

    const allSubmissions = assignments.flatMap(a => a.submissions)
    const gradedSubmissions = allSubmissions.filter(s => s.marks !== null)
    const avgAssignmentScore = gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum, s) => sum + (s.marks ?? 0), 0) / gradedSubmissions.length
        : 0

    const gradedQuizSubmissions = quizSubmissions.filter(s => s.marks !== null)
    const avgQuizScore = gradedQuizSubmissions.length > 0
        ? gradedQuizSubmissions.reduce((sum, s) => sum + (s.marks ?? 0), 0) / gradedQuizSubmissions.length
        : 0

    const overallSubmissionRate = totalAssignments > 0 && students.length > 0
        ? (allSubmissions.length / (totalAssignments * students.length)) * 100
        : 0

    const pendingGradingCount = allSubmissions.filter(s => s.marks === null).length

    const totalSubmissionsCount = allSubmissions.length
    const gradedSubmissionsCount = gradedSubmissions.length
    const totalQuizAttempts = quizSubmissions.length
    const gradedQuizAttempts = gradedQuizSubmissions.length

    const now = new Date()
    const upcomingMeetings = meetings.filter(m => new Date(m.scheduled_at) >= now).length
    const completedMeetings = totalMeetings - upcomingMeetings

    const missingSubmissions = assignments
        .filter(a => new Date(a.due_at) < now)
        .map(a => {
            const submittedIds = new Set(a.submissions.map(s => s.studentId))
            const missingStudents = students
                .filter(cs => !submittedIds.has(cs.user.id))
                .map(cs => ({
                    id: cs.user.id,
                    name: cs.user.name,
                    email: cs.user.email,
                    image: cs.user.image,
                }))
            return {
                id: a.id,
                title: a.title,
                due_at: a.due_at,
                missingStudents,
            }
        })
        .filter(a => a.missingStudents.length > 0)

    const perAssignmentBreakdown = assignments.map(a => {
        const graded = a.submissions.filter(s => s.marks !== null)
        const avgScore = graded.length > 0
            ? graded.reduce((sum, s) => sum + (s.marks ?? 0), 0) / graded.length
            : 0
        return {
            id: a.id,
            title: a.title,
            due_at: a.due_at,
            submissionCount: a.submissions.length,
            avgScore,
        }
    })

    const perQuizBreakdown = quizzes.map(q => {
        const graded = q.submissions.filter(s => s.marks !== null)
        const avgScore = graded.length > 0
            ? graded.reduce((sum, s) => sum + (s.marks ?? 0), 0) / graded.length
            : 0
        return {
            id: q.id,
            title: q.title,
            created_at: q.created_at,
            attemptCount: q.submissions.length,
            avgScore,
        }
    })

    const studentBreakdown = students.map(({ user }) => {
        const studentSubmissions = allSubmissions.filter(s => s.studentId === user.id)
        const studentGraded = studentSubmissions.filter(s => s.marks !== null)
        const studentAvgAssignmentScore = studentGraded.length > 0
            ? studentGraded.reduce((sum, s) => sum + (s.marks ?? 0), 0) / studentGraded.length
            : null

        const studentQuizSubs = quizSubmissions.filter(s => s.studentId === user.id)
        const studentGradedQuizSubs = studentQuizSubs.filter(s => s.marks !== null)
        const studentAvgQuizScore = studentGradedQuizSubs.length > 0
            ? studentGradedQuizSubs.reduce((sum, s) => sum + (s.marks ?? 0), 0) / studentGradedQuizSubs.length
            : null

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            assignmentsSubmitted: studentSubmissions.length,
            totalAssignments,
            avgAssignmentScore: studentAvgAssignmentScore,
            quizzesAttempted: studentQuizSubs.length,
            totalQuizzes,
            avgQuizScore: studentAvgQuizScore,
        }
    })

    return {
        classroom: {
            id: classroom.id,
            className: classroom.className,
            section: classroom.section,
            semester: classroom.semester,
        },
        overview: {
            totalStudents: students.length,
            totalAssignments,
            totalQuizzes,
            totalMeetings,
            totalAnnouncements,
            avgAssignmentScore,
            avgQuizScore,
            overallSubmissionRate,
            pendingGradingCount,
            upcomingMeetings,
            completedMeetings,
            totalSubmissionsCount,
            gradedSubmissionsCount,
            totalQuizAttempts,
            gradedQuizAttempts,
        },
        perAssignmentBreakdown,
        perQuizBreakdown,
        students: studentBreakdown,
        missingSubmissions,
    }
}

export async function getStudentAnalyticsDetail(classroomId: number, studentId: number, teacherId: number) {
    const classroom = await prisma.classroom.findUnique({ where: { id: classroomId } })
    if (!classroom) {
        throw new Error("CLASSROOM_NOT_FOUND")
    }
    if (classroom.teacherId !== teacherId) {
        throw new Error("UNAUTHORIZED")
    }

    const student = await prisma.classroomStudent.findUnique({
        where: { userId_classroomId: { userId: studentId, classroomId } },
        include: { user: { select: { id: true, name: true, email: true, image: true } } }
    })
    if (!student) {
        throw new Error("STUDENT_NOT_FOUND")
    }

    const assignments = await prisma.assignment.findMany({
        where: { classId: classroomId },
        include: { submissions: { where: { studentId } } },
        orderBy: { due_at: 'asc' }
    })

    const assignmentDetails = assignments.map(a => {
        const submission = a.submissions[0]
        return {
            id: a.id,
            title: a.title,
            due_at: a.due_at,
            submitted: !!submission,
            marks: submission?.marks ?? null,
            feedback: submission?.feedback ?? null,
        }
    })

    const quizzes = await prisma.quiz.findMany({
        where: { classroomId },
        orderBy: { created_at: 'asc' }
    })

    const quizSubmissions = await prisma.quizSubmission.findMany({
        where: { studentId, quiz: { classroomId } }
    })

    const quizDetails = quizzes.map(q => {
        const submission = quizSubmissions.find(s => s.quizId === q.id)
        return {
            id: q.id,
            title: q.title,
            attempted: !!submission,
            marks: submission?.marks ?? null,
            status: submission?.status ?? null,
        }
    })

    return {
        student: {
            id: student.user.id,
            name: student.user.name,
            email: student.user.email,
            image: student.user.image,
        },
        assignments: assignmentDetails,
        quizzes: quizDetails,
    }
}