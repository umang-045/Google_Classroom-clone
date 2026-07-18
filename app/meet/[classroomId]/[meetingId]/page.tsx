import MeetRoomServer from '@/app/server/MeetRoomServer'

const MeetPage = async ({ params }: { params: Promise<{ classroomId: string; meetingId: string }> }) => {
    const { classroomId, meetingId } = await params;

    return <MeetRoomServer classroomId={classroomId} meetingId={meetingId} />
}

export default MeetPage