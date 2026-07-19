import AnalyticsServer from '@/app/server/AnalyticsServer'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

const AnalyticsPage = async ({ params }: PageProps) => {
  // Await the params object before accessing its properties
  const { id } = await params;

  return <AnalyticsServer classroomId={id} />
}

export default AnalyticsPage