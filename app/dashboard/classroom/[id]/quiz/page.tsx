import QuizServer from '@/app/server/QuizServer'

const QuizPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    return <QuizServer classroomId={id} />
}

export default QuizPage