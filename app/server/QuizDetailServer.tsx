import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getClassroomDetails } from "@/lib/server/classroomDetails"
import { getQuizDetail } from "@/lib/server/quiz"
import QuizDetailClient from "../components/Quiz/QuizDetailClient"

interface Question {
    id: string
    question: string
    marks: number
    options: string[]
    correctOptionIndex?: number
}

const QuizDetailServer = async ({ classroomId, quizId }: { classroomId: string; quizId: string }) => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return null
    }

    const classId = Number(classroomId)
    const qId = Number(quizId)
    const userId = Number(session.user.id)

    try {
        const { role } = await getClassroomDetails(classId, userId)
        const { quizDetail, submission } = await getQuizDetail(classId, qId, userId)

        const serializedQuiz = {
            ...quizDetail,
            created_at: quizDetail.created_at.toISOString(),
            questions: quizDetail.questions as unknown as Question[],
        }

        return (
            <QuizDetailClient
                classroomId={classroomId}
                initialRole={role}
                initialQuiz={serializedQuiz}
                initialSubmission={submission}
            />
        )
    } catch (err) {
        return <p className='text-center text-white/50 py-12'>Quiz not found.</p>
    }
}

export default QuizDetailServer