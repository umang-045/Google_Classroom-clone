"use client"

import { useEffect, useState } from "react"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import {
  BookOpenIcon,
  GraduationCapIcon,
  ClipboardListIcon,
  MessageCircleIcon,
  CalendarIcon,
} from "lucide-react"

function formatDate(d: string | Date) {
  return new Date(d).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 pt-3 first:pt-0 pb-1 border-b border-zinc-800">
      <Icon className="size-4 text-zinc-500" />
      <span className="text-sm font-semibold text-zinc-400">{children}</span>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center rounded-lg border border-zinc-800/60 bg-zinc-950/20 px-3 py-4 text-xs text-zinc-500 italic min-h-[66px] w-full">
      <span>{text}</span>
    </div>
  )
}

export default function Page() {
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

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
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const enrolled = userData?.enrolledClassrooms || []
  const teaching = userData?.teachingClassrooms || []
  const upcomingAssignments = userData?.upcomingAssignments || []
  const announcements = userData?.announcements || []
  const schedule = userData?.schedule || []

  const teachingAssignments = upcomingAssignments.filter((a: any) => a.role === "teacher").slice(0, 10)
  const enrolledAssignments = upcomingAssignments.filter((a: any) => a.role === "student").slice(0, 10)

  const teachingAnnouncements = announcements.filter((a: any) => a.role === "teacher").slice(0, 10)
  const enrolledAnnouncements = announcements.filter((a: any) => a.role === "student").slice(0, 10)

  const teachingSchedule = schedule.filter((m: any) => m.role === "teacher").slice(0, 10)
  const enrolledSchedule = schedule.filter((m: any) => m.role === "student").slice(0, 10)

  // Reusable hover & brightness classes for item cards
  const cardItemStyle = "flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 transition-all duration-300 hover:bg-zinc-900/80 hover:border-zinc-700 hover:brightness-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.03)] cursor-pointer group"
  const verticalCardItemStyle = "flex flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 min-h-[66px] justify-center transition-all duration-300 hover:bg-zinc-900/80 hover:border-zinc-700 hover:brightness-125 hover:shadow-[0_0_15px_rgba(255,255,255,0.03)] cursor-pointer group"

  return (
    <SidebarInset className="bg-zinc-950">
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[75vh] gap-3">
              <div className="relative flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-zinc-500 duration-1000" />
              </div>
              
            </div>
          ) : (
            /* Smooth entry transition once loaded */
            <div className="animate-in fade-in duration-500 slide-in-from-bottom-2 flex flex-col gap-4 py-4 md:gap-6 md:py-6 w-full">
              <SectionCards data={userData} />

              {/* Enrolled / Teaching Classes */}
              <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
                <Card className="bg-zinc-900 border-zinc-800 shadow-xl shadow-black/20">
                  <CardHeader className="flex flex-row items-center gap-2 pb-2 group cursor-default">
                    <BookOpenIcon className="size-4 text-zinc-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-zinc-200" />
                    <CardTitle className="text-base text-white">Enrolled Classes</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[320px] overflow-y-auto flex flex-col gap-3 pr-1">
                    {enrolled.length === 0 && <EmptyState text="No enrolled classes yet." />}
                    {enrolled.map((c: any) => (
                      <div key={c.id} className={cardItemStyle}>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-200">{c.className}</span>
                          <span className="text-xs text-zinc-500">Taught by {c.teacherName}</span>
                        </div>
                        <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 transition-colors group-hover:border-zinc-600">
                          {c.pending} pending
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 shadow-xl shadow-black/20">
                  <CardHeader className="flex flex-row items-center gap-2 pb-2 group cursor-default">
                    <GraduationCapIcon className="size-4 text-zinc-400 transition-transform duration-300 group-hover:-rotate-12 group-hover:text-zinc-200" />
                    <CardTitle className="text-base text-white">Teaching Classes</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[320px] overflow-y-auto flex flex-col gap-3 pr-1">
                    {teaching.length === 0 && <EmptyState text="You're not teaching any classes yet." />}
                    {teaching.map((c: any) => (
                      <div key={c.id} className={cardItemStyle}>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-200">{c.className}</span>
                          <span className="text-xs text-zinc-500">{c.studentsCount} students</span>
                        </div>
                        <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 transition-colors group-hover:border-zinc-600">
                          {c.pendingGrading} to grade
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Assignments / Announcements */}
              <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
                <Card className="bg-zinc-900 border-zinc-800 shadow-xl shadow-black/20">
                  <CardHeader className="flex flex-row items-center gap-2 pb-2 group cursor-default">
                    <ClipboardListIcon className="size-4 text-zinc-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-zinc-200" />
                    <CardTitle className="text-base text-white">Upcoming Assignments</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    {/* Enrolled Sorted First */}
                    <SectionHeading icon={BookOpenIcon}>Enrolled</SectionHeading>
                    <div className="max-h-[340px] overflow-y-auto flex flex-col gap-3 pr-1">
                      {enrolledAssignments.length === 0 ? (
                        <EmptyState text="No assignments in Enrolled." />
                      ) : (
                        enrolledAssignments.map((a: any) => (
                          <div key={`e-${a.id}`} className={`${cardItemStyle} min-h-[66px]`}>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-200">{a.title}</span>
                              <span className="text-xs text-zinc-500">
                                {a.classroomName} · Due: {formatDate(a.due_at)}
                              </span>
                            </div>
                            <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 shrink-0 transition-colors group-hover:border-zinc-600">
                              {a.submitted ? "Submitted" : "Not submitted"}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Teaching Sorted Second */}
                    <SectionHeading icon={GraduationCapIcon}>Teaching</SectionHeading>
                    <div className="max-h-[340px] overflow-y-auto flex flex-col gap-3 pr-1">
                      {teachingAssignments.length === 0 ? (
                        <EmptyState text="No assignments in Teaching." />
                      ) : (
                        teachingAssignments.map((a: any) => (
                          <div key={`t-${a.id}`} className={`${cardItemStyle} min-h-[66px]`}>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-200">{a.title}</span>
                              <span className="text-xs text-zinc-500">
                                {a.classroomName} · Due: {formatDate(a.due_at)}
                              </span>
                            </div>
                            <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 shrink-0 transition-colors group-hover:border-zinc-600">
                              {a.gradedCount}/{a.submissionCount} graded
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 shadow-xl shadow-black/20">
                  <CardHeader className="flex flex-row items-center gap-2 pb-2 group cursor-default">
                    <MessageCircleIcon className="size-4 text-zinc-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-zinc-200" />
                    <CardTitle className="text-base text-white">Announcements</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    {/* Enrolled Sorted First */}
                    <SectionHeading icon={BookOpenIcon}>Enrolled</SectionHeading>
                    <div className="max-h-[340px] overflow-y-auto flex flex-col gap-3 pr-1">
                      {enrolledAnnouncements.length === 0 ? (
                        <EmptyState text="No announcements in Enrolled." />
                      ) : (
                        enrolledAnnouncements.map((a: any) => (
                          <div key={a.id} className={verticalCardItemStyle}>
                            <span className="text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-200">{a.title}</span>
                            <span className="text-xs text-zinc-500">
                              {a.classroomName} · Posted: {formatDate(a.created_at)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Teaching Sorted Second */}
                    <SectionHeading icon={GraduationCapIcon}>Teaching</SectionHeading>
                    <div className="max-h-[340px] overflow-y-auto flex flex-col gap-3 pr-1">
                      {teachingAnnouncements.length === 0 ? (
                        <EmptyState text="No announcements in Teaching." />
                      ) : (
                        teachingAnnouncements.map((a: any) => (
                          <div key={a.id} className={verticalCardItemStyle}>
                            <span className="text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-200">{a.title}</span>
                            <span className="text-xs text-zinc-500">
                              {a.classroomName} · Posted: {formatDate(a.created_at)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Schedule */}
              <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
                <Card className="bg-zinc-900 border-zinc-800 shadow-xl shadow-black/20">
                  <CardHeader className="flex flex-row items-center gap-2 pb-2 group cursor-default">
                    <CalendarIcon className="size-4 text-zinc-400 transition-transform duration-300 group-hover:rotate-6 group-hover:text-zinc-200" />
                    <CardTitle className="text-base text-white">Schedule · Teaching</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[340px] overflow-y-auto flex flex-col gap-3 pr-1">
                    {teachingSchedule.length === 0 ? (
                      <EmptyState text="No schedule in Teaching." />
                    ) : (
                      teachingSchedule.map((m: any) => (
                        <div key={`t-${m.id}`} className={`${verticalCardItemStyle} w-full`}>
                          <span className="text-xs font-semibold text-zinc-500 transition-colors group-hover:text-zinc-400">{formatDate(m.scheduled_at)}</span>
                          <span className="text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-200">{m.title}</span>
                          <span className="text-xs text-zinc-500">{m.classroomName}</span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 shadow-xl shadow-black/20">
                  <CardHeader className="flex flex-row items-center gap-2 pb-2 group cursor-default">
                    <CalendarIcon className="size-4 text-zinc-400 transition-transform duration-300 group-hover:rotate-6 group-hover:text-zinc-200" />
                    <CardTitle className="text-base text-white">Schedule · Enrolled</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[340px] overflow-y-auto flex flex-col gap-3 pr-1">
                    {enrolledSchedule.length === 0 ? (
                      <EmptyState text="No schedule in Enrolled." />
                    ) : (
                      enrolledSchedule.map((m: any) => (
                        <div key={`e-${m.id}`} className={`${verticalCardItemStyle} w-full`}>
                          <span className="text-xs font-semibold text-zinc-500 transition-colors group-hover:text-zinc-400">{formatDate(m.scheduled_at)}</span>
                          <span className="text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-200">{m.title}</span>
                          <span className="text-xs text-zinc-500">{m.classroomName}</span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarInset>
  )
}