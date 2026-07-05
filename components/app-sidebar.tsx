"use client"
import * as React from "react"
import { useState, useEffect } from "react"
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
  Sparkles,
  Settings2 as Settings2Icon,
  CircleHelp as CircleHelpIcon,
  Search as SearchIcon,
} from "lucide-react"

import { classphoto } from "@/app/components/ClassroomCard"
import AIChatButton from "@/app/components/AiChatButton"

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

const isActive = (url: string) => {
  if (url === "/dashboard") {
    return pathname === url
  } else {
    return pathname === url || pathname.startsWith(url + "/")
  }
}

  const session = useSession();
  const userInfo = session.data;

  const [profile, setProfile] = useState<{ name: string; email: string; image: string | null } | null>(null)
  const [avatarOverride, setAvatarOverride] = useState<string | null>(null);

  useEffect(() => {
    if (!userInfo?.user) return
    fetch("/api/userprofile")
      .then((res) => res.json())
      .then((data) => setProfile(data.user))
      .catch((err) => console.log(err))
  }, [userInfo?.user])

  data.user = {
    name: profile?.name ?? userInfo?.user?.name ?? "",
    email: profile?.email ?? userInfo?.user?.email ?? "",
    avatar: avatarOverride || profile?.image || classphoto(profile?.name ?? userInfo?.user?.name ?? "")
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
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* AI chat trigger — styled as a normal sidebar item, opens the chat modal */}
              <SidebarMenuItem>
                <AIChatButton
                  trigger={(onClick) => (
                    <SidebarMenuButton onClick={onClick}>
                      <Sparkles />
                      <span>Ask AI</span>
                    </SidebarMenuButton>
                  )}
                />
              </SidebarMenuItem>

              {data.general.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={isActive(item.url)} render={<a href={item.url} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Enrolled</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.enrolled.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={isActive(item.url)} render={<a href={item.url} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Teaching</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.teaching.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={isActive(item.url)} render={<a href={item.url} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} onAvatarChange={setAvatarOverride} />
      </SidebarFooter>
    </Sidebar>
  )
}