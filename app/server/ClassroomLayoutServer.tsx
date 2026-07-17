import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getClassroomDetails } from "@/lib/server/classroomDetails"
import ClassroomLayoutClient from "../components/ClassroomLayoutClient"

const ClassroomLayoutServer = async ({ classroomId, children }: { classroomId: string; children: React.ReactNode }) => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return null
    }

    const id = Number(classroomId)

    try {
        const { classroom, role } = await getClassroomDetails(id, Number(session.user.id))

        return (
            <ClassroomLayoutClient initialClassroomDetails={classroom} initialRole={role}>
                {children}
            </ClassroomLayoutClient>
        )
    } catch (err) {
        return <p className="text-center py-10">Classroom not found</p>
    }
}

export default ClassroomLayoutServer