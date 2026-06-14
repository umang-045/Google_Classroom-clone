"use client"

import { useEffect, useState } from "react"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpenIcon,
  GraduationCapIcon,
  ClipboardListIcon,
  BellIcon,
  MessageCircleIcon,
  CalendarIcon,
} from "lucide-react"

export default function Page() {
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/user-dashboard")
        if (res.ok) {
          const json = await res.json()
          setUserData(json.data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const enrolled = userData?.enrolledClassrooms || []
  const teaching = userData?.teachingClassrooms || []

  return (
    <SidebarInset className="bg-zinc-950">
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

            <SectionCards data={userData} />

            <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <BookOpenIcon className="size-4 text-zinc-400" />
                  <CardTitle className="text-base text-white">Enrolled Classes</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[320px] overflow-y-auto flex flex-col gap-3">
                  {enrolled.map(({ classroom }: any) => (
                    <div key={classroom?.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-zinc-300">{classroom?.className || classroom?.name}</span>
                        <span className="text-xs text-zinc-500">
                           "Schedule"
                        </span>
                      </div>
                      <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">0 pending</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <GraduationCapIcon className="size-4 text-zinc-400" />
                  <CardTitle className="text-base text-white">Teaching Classes</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[320px] overflow-y-auto flex flex-col gap-3">
                  {teaching.map((classroom: any) => (
                    <div key={classroom.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-zinc-300">
                          {classroom.className || classroom.name}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {classroom.students?.length || 0} students
                        </span>
                      </div>
                      <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">0 to grade</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

            </div>

            <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <ClipboardListIcon className="size-4 text-zinc-400" />
                  <CardTitle className="text-base text-white">Upcoming Assignments</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-zinc-300">Assignment Title</span>
                        <span className="text-xs text-zinc-500">Class Name</span>
                        <span className="text-xs text-zinc-500">Due: —</span>
                      </div>
                      <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">—</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <BellIcon className="size-4 text-zinc-400" />
                  <CardTitle className="text-base text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <BellIcon className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-zinc-300">Activity title</span>
                        <span className="text-xs text-zinc-500">Class · detail</span>
                      </div>
                      <span className="ml-auto text-xs text-zinc-500 whitespace-nowrap">—</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <MessageCircleIcon className="size-4 text-zinc-400" />
                  <CardTitle className="text-base text-white">Announcements</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
                      <span className="text-sm font-medium text-zinc-300">Announcement title</span>
                      <span className="text-xs text-zinc-500">Class Name · —</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

            </div>

            <div className="px-4 lg:px-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <CalendarIcon className="size-4 text-zinc-400" />
                  <CardTitle className="text-base text-white">Upcoming Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {enrolled.map(({ classroom }: any) => (
                      <div key={classroom?.id} className="flex flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
                        <span className="text-xs text-zinc-500">{classroom?.schedule || "Day · Time"}</span>
                        <span className="text-sm font-medium text-zinc-300">{classroom?.name}</span>
                        <Badge className="w-fit bg-zinc-800 text-zinc-400 border-zinc-700">Enrolled</Badge>
                      </div>
                    ))}
                    {teaching.map((classroom: any) => (
                      <div key={classroom.id} className="flex flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
                        <span className="text-xs text-zinc-500">{classroom.schedule || "Day · Time"}</span>
                        <span className="text-sm font-medium text-zinc-300">{classroom.name}</span>
                        <Badge className="w-fit bg-zinc-800 text-zinc-400 border-zinc-700">Teaching</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </SidebarInset>
  )
}