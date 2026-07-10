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

  const baseCardStyle = "bg-zinc-900 border-zinc-800 transition-all duration-300 hover:brightness-110 group cursor-default"

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

      <Card className={`${baseCardStyle} cursor-pointer hover:border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.05)] hover:shadow-[0_0_20px_rgba(59,130,246,0.12)]`}>
        <CardHeader>
          <CardDescription className="text-zinc-400">Enrolled Classes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {enrolledCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 group-hover:border-blue-500/30 transition-colors">
              <BookOpenIcon className="size-3 text-blue-400 mr-1" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm border-zinc-800">
          <div className="line-clamp-1 flex gap-2 font-medium text-zinc-300">
            Classes this semester
          </div>
          <div className="text-zinc-500">Across all enrolled classes</div>
        </CardFooter>
      </Card>

      
      <Card className={`${baseCardStyle} cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.05)] hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.12)]`}>
        <CardHeader>
          <CardDescription className="text-zinc-400">Classes Teaching</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {teachingCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 group-hover:border-purple-500/30 transition-colors">
              <GraduationCapIcon className="size-3 text-purple-400 mr-1" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm border-zinc-800">
          <div className="line-clamp-1 flex gap-2 font-medium text-zinc-300">
            {totalStudents} students enrolled
          </div>
          <div className="text-zinc-500">{pendingGrading} submissions need grading</div>
        </CardFooter>
      </Card>

     
      <Card className={`${baseCardStyle} cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.05)] hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.12)]`}>
        <CardHeader>
          <CardDescription className="text-zinc-400">Pending Assignments</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {upcomingAssignmentsCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 group-hover:border-amber-500/30 transition-colors">
              <ClipboardListIcon className="size-3 text-amber-400 mr-1" />
              Due Soon
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm border-zinc-800">
          <div className="line-clamp-1 flex gap-2 font-medium text-zinc-300">
            Upcoming across all classes
          </div>
          <div className="text-zinc-500">Across all enrolled classes</div>
        </CardFooter>
      </Card>

      <Card className={`${baseCardStyle} cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]`}>
        <CardHeader>
          <CardDescription className="text-zinc-400">Announcements</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-white">
            {announcementsCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 group-hover:border-emerald-500/30 transition-colors">
              <MessageCircleIcon className="size-3 text-emerald-400 mr-1" />
              Recent
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm border-zinc-800">
          <div className="line-clamp-1 flex gap-2 font-medium text-zinc-300">
            {pendingGrading} submissions need grading
          </div>
          <div className="text-zinc-500">Across all teaching classes</div>
        </CardFooter>
      </Card>

    </div>
  )
}