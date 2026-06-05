"use client"
import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Umang",
    email: "umang@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "General",
      url: "#",
      icon: <span>🏠</span>,
      isActive: true,
      items: [
        { title: "Dashboard",     url: "/dashboard" },
        { title: "Notifications", url: "/dashboard/notifications" },
        { title: "All Classes",   url: "/dashboard/allclasses" },
      ],
    },
    {
      title: "Enrolled",
      url: "#",
      icon: <span>🎓</span>,
      items: [
        { title: "My Classroom",   url: "/dashboard/enrolled/myclassroom" },
        { title: "Assignments",    url: "/dashboard/enrolled/assignments" },
        { title: "Announcements",  url: "/dashboard/enrolled/announcements" },
        { title: "Classroom Chat", url: "/dashboard/enrolled/classroomchat" },
      ],
    },
    {
      title: "Teaching",
      url: "#",
      icon: <span>📖</span>,
      items: [
        { title: "My Classroom",   url: "/dashboard/teaching/myclassroom" },
        { title: "Assignments",    url: "/dashboard/teaching/assignments" },
        { title: "Announcements",  url: "/dashboard/teaching/announcements" },
        { title: "Classroom Chat", url: "/dashboard/teaching/classroomchat" },
      ],
    },
    {
      title: "Tools",
      url: "#",
      icon: <span>⚙️</span>,
      items: [
        { title: "Settings", url: "/dashboard/tools/settings" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
  <Sidebar collapsible="icon" {...props} >
      <SidebarHeader className=" border-b-2 px-4 py-9">
        <h1 className="font-bold text-2xl">Digital<span className="text-blue-800 font-bold text-2xl">Classroom</span></h1>
      </SidebarHeader>
      <SidebarContent className="" >
        <NavMain  items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}