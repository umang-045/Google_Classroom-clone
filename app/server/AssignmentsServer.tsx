import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getAssignmentsForClassroom } from "@/lib/server/assignments"
import AssignmentsClient from "../components/Assignment/AssignmentClient"

const AssignmentsServer = async ({ classroomId }: { classroomId: string }) => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return <p>Login and Try Again</p>
    }

    const classId = Number(classroomId)

    try {
        const { assignments, role } = await getAssignmentsForClassroom(classId, Number(session.user.id))

        const serializedAssignments = assignments.map((a) => ({
            ...a,
            created_at: a.created_at.toISOString(),
            due_at: a.due_at.toISOString(),
        }))

        return (
            <AssignmentsClient
                classroomId={classroomId}
                initialRole={role}
                initialAssignments={serializedAssignments}
            />
        )
    } catch (err) {
        return (
            <p className='text-center text-white/50 py-12'>
                Couldn't load assignments. Try refreshing.
            </p>
        )
    }
}

export default AssignmentsServer