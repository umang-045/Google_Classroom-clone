"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BookOpenIcon,
  ClipboardListIcon,
  MessageCircleIcon,
  GraduationCapIcon,
} from "lucide-react"

export function SectionCards({ data }: { data: any }) {
  const stats = data?.stats || {}

  
  const enrolledCount = stats.totalEnrolled ?? data?.enrolledClassrooms?.length ?? 0
  const teachingCount = stats.totalTeaching ?? data?.teachingClassrooms?.length ?? 0
  const pendingGrading = stats.totalPendingGrading ?? 0
  const upcomingAssignmentsCount =
    stats.totalUpcomingAssignments ?? data?.upcomingAssignments?.length ?? 0
  const announcementsCount = data?.announcements?.length ?? 0


  const totalStudents =
    data?.teachingClassrooms?.reduce(
      (count: number, classroom: any) =>
        count + (classroom.studentsCount ?? classroom.students?.length ?? 0),
      0
    ) || 0

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

      <Card className="bg-neutral-800 border-neutral-700">
        <CardHeader>
          <CardDescription className="text-neutral-400">Enrolled Classes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {enrolledCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-neutral-600 text-neutral-300">
              <BookOpenIcon className="size-3" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm border-neutral-700">
          <div className="line-clamp-1 flex gap-2 font-medium text-neutral-300">
            Classes this semester
          </div>
          <div className="text-neutral-500">Across all enrolled classes</div>
        </CardFooter>
      </Card>

      <Card className="bg-neutral-800 border-neutral-700">
        <CardHeader>
          <CardDescription className="text-neutral-400">Classes Teaching</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {teachingCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-neutral-600 text-neutral-300">
              <GraduationCapIcon className="size-3" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm border-neutral-700">
          <div className="line-clamp-1 flex gap-2 font-medium text-neutral-300">
            {totalStudents} students enrolled
          </div>
          <div className="text-neutral-500">{pendingGrading} submissions need grading</div>
        </CardFooter>
      </Card>

      <Card className="bg-neutral-800 border-neutral-700">
        <CardHeader>
          <CardDescription className="text-neutral-400">Pending Assignments</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {upcomingAssignmentsCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-neutral-600 text-neutral-300">
              <ClipboardListIcon className="size-3" />
              Due Soon
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm border-neutral-700">
          <div className="line-clamp-1 flex gap-2 font-medium text-neutral-300">
            Upcoming across all classes
          </div>
          <div className="text-neutral-500">Across all enrolled classes</div>
        </CardFooter>
      </Card>

      <Card className="bg-neutral-800 border-neutral-700">
        <CardHeader>
          <CardDescription className="text-neutral-400">Announcements</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {announcementsCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-neutral-600 text-neutral-300">
              <MessageCircleIcon className="size-3" />
              Recent
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm border-neutral-700">
          <div className="line-clamp-1 flex gap-2 font-medium text-neutral-300">
            {pendingGrading} submissions need grading
          </div>
          <div className="text-neutral-500">Across all teaching classes</div>
        </CardFooter>
      </Card>

    </div>
  )
}