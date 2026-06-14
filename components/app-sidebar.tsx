"use client"
import * as React from "react"
import { usePathname } from "next/navigation"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { useSession } from "next-auth/react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Bell,
  Library,
  School,
  ClipboardList,
  Megaphone,
  MessageCircle,
  BookOpen,
  ClipboardCheck,
  Radio,
  Settings2 as Settings2Icon,
  CircleHelp as CircleHelpIcon,
  Search as SearchIcon,
} from "lucide-react"

import { classphoto } from "@/app/components/ClassroomCard"



const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  general: [
    { title: "Dashboard",     icon: LayoutDashboard, url: "/dashboard" },
    { title: "Notifications", icon: Bell,            url: "/dashboard/notifications" },
    { title: "All Classes",   icon: Library,         url: "/dashboard/allclasses" },
  ],
  enrolled: [
    { title: "My Classroom",   icon: School,          url: "/dashboard/enrolled/myclassroom" },
    { title: "Assignments",    icon: ClipboardList,   url: "/dashboard/enrolled/assignments" },
    { title: "Announcements",  icon: Megaphone,       url: "/dashboard/enrolled/announcements" },
    { title: "Classroom Chat", icon: MessageCircle,   url: "/dashboard/enrolled/classroomchat" },
  ],
  teaching: [
    { title: "My Classroom",   icon: BookOpen,        url: "/dashboard/teaching/myclassroom" },
    { title: "Assignments",    icon: ClipboardCheck,  url: "/dashboard/teaching/assignments" },
    { title: "Announcements",  icon: Radio,           url: "/dashboard/teaching/announcements" },
    { title: "Classroom Chat", icon: MessageCircle,   url: "/dashboard/teaching/classroomchat" },
  ],
  navSecondary: [
    { title: "Settings", url: "/dashboard/settings", icon: <Settings2Icon /> },
    { title: "Get Help", url: "/dashboard/help",     icon: <CircleHelpIcon /> },
    { title: "Search",   url: "/dashboard/search",   icon: <SearchIcon /> },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

const isActive = (url: string) =>
  url === "/dashboard"
    ? pathname === url
    : pathname === url || pathname.startsWith(url + "/")

const session = useSession();
const userInfo = session.data;

data.user = {
    name: userInfo?.user?.name ?? "",
    email: userInfo?.user?.email ?? "",
    avatar: classphoto(userInfo?.user?.name ?? "")
} 

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="/dashboard" />}
            >
              <span className="text-base font-bold mt-2">
                <span className="text-white text-2xl">Digital</span>
                <span className="text-blue-500 text-2xl">Classroom</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="mt-5">

        {/* GENERAL */}
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.general.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.url)}
                    render={<a href={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* ENROLLED */}
        <SidebarGroup>
          <SidebarGroupLabel>Enrolled</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.enrolled.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.url)}
                    render={<a href={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* TEACHING */}
        <SidebarGroup>
          <SidebarGroupLabel>Teaching</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.teaching.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.url)}
                    render={<a href={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* NavSecondary */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter >
        <NavUser user={data.user}  />
      </SidebarFooter>
    </Sidebar>
  )
}