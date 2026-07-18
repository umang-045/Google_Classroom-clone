import QuizDetailServer from '@/app/server/QuizDetailServer'

const QuizDetailPage = async ({ params }: { params: Promise<{ id: string; quizId: string }> }) => {
    const { id, quizId } = await params;

    return <QuizDetailServer classroomId={id} quizId={quizId} />
}

export default QuizDetailPage