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
  colorClass,
  children,
}: {
  icon: React.ElementType
  colorClass: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 pt-4 first:pt-0 pb-1.5 border-b border-zinc-800/80">
      <Icon className={`size-4 ${colorClass}`} />
      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{children}</span>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center rounded-lg border border-zinc-800/40 bg-zinc-950/40 px-3 py-4 text-xs text-zinc-500 italic min-h-[66px] w-full">
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


  const itemRowStyle = "relative overflow-hidden flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 transition-all duration-300 hover:bg-zinc-800/50 hover:border-zinc-700/80 hover:translate-x-1 cursor-pointer group w-full shrink-0"
  const baseCardStyle = "bg-[#121214] border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:brightness-110"

  return (
    <SidebarInset className="bg-[#09090b]">
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[75vh] gap-3">
              <div className="relative flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-blue-500" />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500 slide-in-from-bottom-2 flex flex-col gap-4 py-4 md:gap-6 md:py-6 w-full">
              <SectionCards data={userData} />

            
              <div className="grid grid-cols-1 gap-5 px-4 lg:grid-cols-2 lg:px-6">
                
                <Card className={`${baseCardStyle} hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]`}>
                  <CardHeader className="flex flex-row items-center gap-2 pb-3 group cursor-default">
                    <BookOpenIcon className="size-5 text-blue-400 transition-transform duration-300 group-hover:scale-110" />
                    <CardTitle className="text-base font-semibold text-zinc-100">Enrolled Classes</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[350px] overflow-y-auto flex flex-col gap-3 pr-1">
                    {enrolled.length === 0 && <EmptyState text="No enrolled classes yet." />}
                    {enrolled.map((c: any) => (
                      <div key={c.id} className={itemRowStyle}>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/40 transition-all duration-300 group-hover:w-1.5 group-hover:bg-blue-400" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold tracking-wide uppercase text-zinc-200 transition-colors group-hover:text-white">{c.className}</span>
                          <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-400">Taught by <span className="text-zinc-400">{c.teacherName}</span></span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

             
                <Card className={`${baseCardStyle} hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]`}>
                  <CardHeader className="flex flex-row items-center gap-2 pb-3 group cursor-default">
                    <GraduationCapIcon className="size-5 text-purple-400 transition-transform duration-300 group-hover:-rotate-12" />
                    <CardTitle className="text-base font-semibold text-zinc-100">Teaching Classes</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[350px] overflow-y-auto flex flex-col gap-3 pr-1">
                    {teaching.length === 0 && <EmptyState text="You're not teaching any classes yet." />}
                    {teaching.map((c: any) => (
                      <div key={c.id} className={itemRowStyle}>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500/40 transition-all duration-300 group-hover:w-1.5 group-hover:bg-purple-400" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold tracking-wide uppercase text-zinc-200 transition-colors group-hover:text-white">{c.className}</span>
                          <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-400">Total Students · <span className="text-zinc-400 font-semibold">{c.studentsCount} students</span></span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

            
              <div className="grid grid-cols-1 gap-5 px-4 lg:grid-cols-2 lg:px-6">
                
         
                <Card className={`${baseCardStyle} hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]`}>
                  <CardHeader className="flex flex-row items-center gap-2 pb-3 group cursor-default">
                    <ClipboardListIcon className="size-5 text-amber-400 transition-transform duration-300 group-hover:-translate-y-0.5" />
                    <CardTitle className="text-base font-semibold text-zinc-100">Upcoming Assignments</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                   
                    <SectionHeading icon={BookOpenIcon} colorClass="text-blue-400">Enrolled</SectionHeading>
                    <div className="max-h-[260px] overflow-y-auto flex flex-col gap-2.5 pr-1 w-full">
                      {enrolledAssignments.length === 0 ? (
                        <EmptyState text="No assignments in Enrolled." />
                      ) : (
                        enrolledAssignments.map((a: any) => (
                          <div key={`e-${a.id}`} className={itemRowStyle}>
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/40 transition-all duration-300 group-hover:w-1.5 group-hover:bg-blue-400" />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-bold tracking-wide uppercase text-zinc-200 group-hover:text-white">{a.title}</span>
                              <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300">{a.classroomName} · Due: {formatDate(a.due_at)}</span>
                            </div>
                            <Badge className={`px-2.5 py-0.5 font-medium rounded-md border ${
                              a.submitted 
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }`}>
                              {a.submitted ? "Submitted" : "Missing"}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>

                    <SectionHeading icon={GraduationCapIcon} colorClass="text-purple-400">Teaching</SectionHeading>
                    <div className="max-h-[260px] overflow-y-auto flex flex-col gap-2.5 pr-1 w-full">
                      {teachingAssignments.length === 0 ? (
                        <EmptyState text="No assignments in Teaching." />
                      ) : (
                        teachingAssignments.map((a: any) => (
                          <div key={`t-${a.id}`} className={itemRowStyle}>
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500/40 transition-all duration-300 group-hover:w-1.5 group-hover:bg-purple-400" />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-bold tracking-wide uppercase text-zinc-200 group-hover:text-white">{a.title}</span>
                              <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300">{a.classroomName} · Due: {formatDate(a.due_at)}</span>
                            </div>
                            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 font-medium rounded-md flex-shrink-0">
                              {a.gradedCount}/{a.submissionCount} graded
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

             
                <Card className={`${baseCardStyle} hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]`}>
                  <CardHeader className="flex flex-row items-center gap-2 pb-3 group cursor-default">
                    <MessageCircleIcon className="size-5 text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
                    <CardTitle className="text-base font-semibold text-zinc-100">Announcements</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    
                    <SectionHeading icon={BookOpenIcon} colorClass="text-blue-400">Enrolled</SectionHeading>
                    <div className="max-h-[260px] overflow-y-auto flex flex-col gap-2.5 pr-1 w-full">
                      {enrolledAnnouncements.length === 0 ? (
                        <EmptyState text="No announcements in Enrolled." />
                      ) : (
                        enrolledAnnouncements.map((a: any) => (
                          <div key={a.id} className={itemRowStyle}>
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/40 transition-all duration-300 group-hover:w-1.5 group-hover:bg-blue-400" />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-bold tracking-wide uppercase text-zinc-200 group-hover:text-white">{a.title}</span>
                              <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300">{a.classroomName} · Posted: {formatDate(a.created_at)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <SectionHeading icon={GraduationCapIcon} colorClass="text-purple-400">Teaching</SectionHeading>
                    <div className="max-h-[260px] overflow-y-auto flex flex-col gap-2.5 pr-1 w-full">
                      {teachingAnnouncements.length === 0 ? (
                        <EmptyState text="No announcements in Teaching." />
                      ) : (
                        teachingAnnouncements.map((a: any) => (
                          <div key={a.id} className={itemRowStyle}>
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500/40 transition-all duration-300 group-hover:w-1.5 group-hover:bg-purple-400" />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-bold tracking-wide uppercase text-zinc-200 group-hover:text-white">{a.title}</span>
                              <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300">{a.classroomName} · Posted: {formatDate(a.created_at)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

   
              <div className="grid grid-cols-1 gap-5 px-4 lg:grid-cols-2 lg:px-6">
                
               
                <Card className={`${baseCardStyle} hover:border-zinc-700 hover:shadow-[0_0_25px_rgba(255,255,255,0.03)]`}>
                  <CardHeader className="flex flex-row items-center gap-2 pb-3 group cursor-default">
                    <CalendarIcon className="size-5 text-zinc-400 transition-transform duration-300 group-hover:rotate-6 group-hover:text-white" />
                    <CardTitle className="text-base font-semibold text-zinc-100">Schedule · Teaching</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[340px] overflow-y-auto flex flex-col gap-3 pr-1">
                    {teachingSchedule.length === 0 ? (
                      <EmptyState text="No schedule in Teaching." />
                    ) : (
                      teachingSchedule.map((m: any) => (
                        <div key={`t-${m.id}`} className={itemRowStyle}>
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500/40 transition-all duration-300 group-hover:w-1.5 group-hover:bg-purple-400" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-purple-400 tracking-wide">{formatDate(m.scheduled_at)}</span>
                            <span className="text-sm font-bold tracking-wide uppercase text-zinc-200 group-hover:text-white">{m.title}</span>
                            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300">{m.classroomName}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                
                <Card className={`${baseCardStyle} hover:border-zinc-700 hover:shadow-[0_0_25px_rgba(255,255,255,0.03)]`}>
                  <CardHeader className="flex flex-row items-center gap-2 pb-3 group cursor-default">
                    <CalendarIcon className="size-4 text-zinc-400 transition-transform duration-300 group-hover:rotate-6 group-hover:text-white" />
                    <CardTitle className="text-base font-semibold text-zinc-100">Schedule · Enrolled</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[340px] overflow-y-auto flex flex-col gap-3 pr-1">
                    {enrolledSchedule.length === 0 ? (
                      <EmptyState text="No schedule in Enrolled." />
                    ) : (
                      enrolledSchedule.map((m: any) => (
                        <div key={`e-${m.id}`} className={itemRowStyle}>
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/40 transition-all duration-300 group-hover:w-1.5 group-hover:bg-blue-400" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-blue-400 tracking-wide">{formatDate(m.scheduled_at)}</span>
                            <span className="text-sm font-bold tracking-wide uppercase text-zinc-200 group-hover:text-white">{m.title}</span>
                            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300">{m.classroomName}</span>
                          </div>
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