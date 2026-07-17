import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getUserClassrooms } from "@/lib/server/classrooms"
import AllClassesClient from "../components/AllClassesClient"

const AllClassesServer = async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return <p>Login and Try Again</p>
    }

    const userId = parseInt(session.user.id as string)
    const { teachingClassroom, enrolledClassroom, pendingRequests } = await getUserClassrooms(userId)

    return (
        <AllClassesClient
            initialTeachingClassroom={teachingClassroom}
            initialEnrolledClassroom={enrolledClassroom}
            initialPendingRequests={pendingRequests}
        />
    )
}

export default AllClassesServer