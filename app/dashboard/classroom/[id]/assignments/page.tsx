import AssignmentsServer from "@/app/server/AssignmentsServer"


const AssignmentsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    return <AssignmentsServer classroomId={id} />
}

export default AssignmentsPage