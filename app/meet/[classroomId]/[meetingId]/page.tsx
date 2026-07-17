import MeetServer from '@/app/server/MeetServer'

const MeetPage = ({ params }: { params: { id: string } }) => {
    return <MeetServer classroomId={params.id} />
}

export default MeetPage