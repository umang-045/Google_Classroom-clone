import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getClassroomRole } from "@/lib/server/classroomDetails"
import MeetRoomComponent from "../components/Meetings/MeetRoomComponent"

const MeetRoomServer = async ({ classroomId, meetingId }: { classroomId: string; meetingId: string }) => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-red-400 text-sm p-4 text-center">Login and Try Again</div>
    }

    try {
        const { role } = await getClassroomRole(Number(classroomId), Number(session.user.id))

        return <MeetRoomComponent classroomId={classroomId} meetingId={meetingId} initialRole={role} />
    } catch (err) {
        return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-red-400 text-sm p-4 text-center">Could not verify access</div>
    }
}

export default MeetRoomServer