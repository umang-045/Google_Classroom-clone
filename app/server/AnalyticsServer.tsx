import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getClassroomAnalytics } from "@/lib/server/analytics"
import AnalyticsClient from "../components/AnalyticsClient"

const AnalyticsServer = async ({ classroomId }: { classroomId: string }) => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return null
    }

    const classId = Number(classroomId)

    try {
        const { classroom, overview, perAssignmentBreakdown, perQuizBreakdown, students, missingSubmissions } = await getClassroomAnalytics(classId, Number(session.user.id))

        const serializedAssignments = perAssignmentBreakdown.map((a) => ({
            ...a,
            due_at: a.due_at.toISOString(),
        }))

        const serializedQuizzes = perQuizBreakdown.map((q) => ({
            ...q,
            created_at: q.created_at.toISOString(),
        }))

        const serializedMissingSubmissions = missingSubmissions.map((a) => ({
            ...a,
            due_at: a.due_at.toISOString(),
        }))

        return (
            <AnalyticsClient
                classroomId={classroomId}
                teacherName={session.user.name || "Teacher"}
                initialClassroom={classroom}
                initialOverview={overview}
                initialAssignmentBreakdown={serializedAssignments}
                initialQuizBreakdown={serializedQuizzes}
                initialStudents={students}
                initialMissingSubmissions={serializedMissingSubmissions}
            />
        )
    } catch (err) {
        return <p className="text-center text-white/50 py-12">You don't have access to this page.</p>
    }
}

export default AnalyticsServer