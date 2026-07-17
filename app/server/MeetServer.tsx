import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getClassroomRole } from "@/lib/server/classroomDetails"
import { getMeetingsForClassroom } from "@/lib/server/meeting"
import MeetClient from "../components/Meetings/MeetClient"

const MeetServer = async ({ classroomId }: { classroomId: string }) => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return null
    }

    const classId = Number(classroomId)

    try {
        const { role } = await getClassroomRole(classId, Number(session.user.id))
        const { meetings } = await getMeetingsForClassroom(classId, Number(session.user.id))

        const serializedMeetings = meetings.map((m) => ({
            ...m,
            status: m.status as "SCHEDULED" | "LIVE" | "ENDED",
            scheduled_at: m.scheduled_at.toISOString(),
        }))

        return (
            <MeetClient
                classroomId={classroomId}
                initialRole={role}
                initialMeetings={serializedMeetings}
            />
        )
    } catch (err) {
        return null
    }
}

export default MeetServer