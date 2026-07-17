import AssignmentDetailServer from '@/app/server/AssignmentDetailServer'

const AssignmentDetailPage = async ({ params }: { params: Promise<{ id: string; assignmentId: string }> }) => {
    const { id, assignmentId } = await params;

    return <AssignmentDetailServer classroomId={id} assignmentId={assignmentId} />
}

export default AssignmentDetailPage