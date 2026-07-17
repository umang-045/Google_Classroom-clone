import MembersServer from "@/app/server/MemberServer"

const Members = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    return <MembersServer classroomId={id} />
}

export default Members