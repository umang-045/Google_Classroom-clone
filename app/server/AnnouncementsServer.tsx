import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getClassroomRole } from "@/lib/server/classroomDetails"
import { getAnnouncementsForClassroom } from "@/lib/server/announcements"
import AnnouncementsClient from "../components/Announcement/AnnouncementClient"

const AnnouncementsServer = async ({ classroomId }: { classroomId: string }) => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return null
    }

    const classId = Number(classroomId)

    try {
        const { role } = await getClassroomRole(classId, Number(session.user.id))
        const { allAnnouncement } = await getAnnouncementsForClassroom(classId, Number(session.user.id))

        const serializedAnnouncements = allAnnouncement.map((a) => ({
            ...a,
            created_at: a.created_at.toISOString(),
        }))

        return (
            <AnnouncementsClient
                classroomId={classroomId}
                initialRole={role}
                initialAnnouncements={serializedAnnouncements}
            />
        )
    } catch (err) {
        return null
    }
}

export default AnnouncementsServer