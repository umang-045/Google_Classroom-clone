import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getClassroomDetails } from "@/lib/server/classroomDetails"
import { getQuizzesForClassroom } from "@/lib/server/quiz"
import QuizClient from "../components/Quiz/QuizClient"

const QuizServer = async ({ classroomId }: { classroomId: string }) => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return null
    }

    const classId = Number(classroomId)

    try {
        const { role } = await getClassroomDetails(classId, Number(session.user.id))
        const { allquizInfo } = await getQuizzesForClassroom(classId, Number(session.user.id))

        const serializedQuizInfo = allquizInfo.map((q) => ({
            ...q,
            created_at: q.created_at.toISOString(),
        }))

        return (
            <QuizClient
                classroomId={classroomId}
                initialRole={role}
                initialQuizInfo={serializedQuizInfo}
            />
        )
    } catch (err) {
        return null
    }
}

export default QuizServer