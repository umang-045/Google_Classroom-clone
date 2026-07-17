import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getClassroomDetails, getClassroomRequests } from "@/lib/server/classroomDetails"
import MembersClient from "../components/MembersClient"

const MembersServer = async ({ classroomId }: { classroomId: string }) => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return null
    }

    const id = Number(classroomId)

    try {
        const { classroom, role } = await getClassroomDetails(id, Number(session.user.id))

        let requests: any[] = []
        if (role === "teacher") {
            const result = await getClassroomRequests(id, Number(session.user.id))
            requests = result.requests
        }

        return (
            <MembersClient
                classroomId={classroomId}
                initialClassroomDetails={classroom}
                initialRole={role}
                initialRequests={requests}
            />
        )
    } catch (err) {
        return null
    }
}

export default MembersServer