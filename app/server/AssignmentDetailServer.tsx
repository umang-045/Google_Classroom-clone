import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getClassroomDetails } from "@/lib/server/classroomDetails"
import { getAssignmentsForClassroom, getSubmissionsForAssignment } from '@/lib/server/assignments'
import AssignmentDetailClient from "../components/Assignment/AssignmentDetailClient"

const AssignmentDetailServer = async ({ classroomId, assignmentId }: { classroomId: string; assignmentId: string }) => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return null
    }

    const classId = Number(classroomId)
    const assignId = Number(assignmentId)
    const userId = Number(session.user.id)

    try {
        const { role } = await getClassroomDetails(classId, userId)
        const { assignments } = await getAssignmentsForClassroom(classId, userId)

        const found = assignments.find((a) => a.id === assignId)
        if (!found) {
            return <div className='p-8 text-center text-destructive'>Assignment not found</div>
        }

        let submissions: any[] = []
        if (role === "teacher") {
            const result = await getSubmissionsForAssignment(classId, assignId, userId)
            submissions = result.submissions
        }

        const serializedAssignment = {
            ...found,
            due_at: found.due_at.toISOString(),
        }

        const serializedSubmissions = submissions.map((s) => ({
            ...s,
            submittedAt: s.submittedAt ? s.submittedAt.toISOString() : null,
        }))

        return (
            <AssignmentDetailClient
                classroomId={classroomId}
                initialRole={role}
                initialAssignment={serializedAssignment}
                initialSubmissions={serializedSubmissions}
            />
        )
    } catch (err) {
        return <div className='p-8 text-center text-destructive'>Something went wrong loading assignment</div>
    }
}

export default AssignmentDetailServer