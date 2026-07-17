import MeetServer from '@/app/server/MeetServer'


const MeetPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    
    const { id } = await params;

    return <MeetServer classroomId={id} />
}

export default MeetPage