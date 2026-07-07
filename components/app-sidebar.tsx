"use client"
import * as React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { useSession } from "next-auth/react"
import { ChevronRight } from "lucide-react"
import { useNotifications } from "@/lib/notification"
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  LayoutDashboard,
  Bell,
  Library,
  School,
  BookOpen,
  Sparkles,
  CircleHelp as CircleHelpIcon,
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
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Notifications", icon: Bell, url: "/dashboard/notifications" },
    { title: "All Classes", icon: Library, url: "/dashboard/allclasses" },
  ],
  navSecondary: [
    { title: "Get Help", url: "/#faqs", icon: <CircleHelpIcon /> },
    { title: "Contact Us", url: "/#contact", icon: <CircleHelpIcon /> },
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
  const { unreadCount } = useNotifications((userInfo?.user as any)?.id);
  const [profile, setProfile] = useState<{ name: string; email: string; image: string | null } | null>(null)
  const [avatarOverride, setAvatarOverride] = useState<string | null>(null);

  const [teachingClassrooms, setTeachingClassrooms] = useState<any[]>([])
  const [enrolledClassrooms, setEnrolledClassrooms] = useState<any[]>([])

  useEffect(() => {
    if (!userInfo?.user) return
    fetch("/api/userprofile")
      .then((res) => res.json())
      .then((data) => setProfile(data.user))
      .catch((err) => console.log(err))
  }, [userInfo?.user])

  useEffect(() => {
    if (!userInfo?.user) return
    fetch("/api/user/classrooms")
      .then((res) => res.json())
      .then((data) => {
        setTeachingClassrooms(data.teachingClassroom || [])
        setEnrolledClassrooms(data.enrolledClassroom || [])
      })
      .catch((err) => console.log("Error loading sidebar classrooms:", err))
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
                    <div className="flex items-center justify-between w-full">
                      <span>{item.title}</span>
                      {item.title === "Notifications" && unreadCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-200 px-1.5 text-[11px] font-bold text-zinc-950 ring-1 ring-background">
                          {unreadCount}
                        </span>
                      )}
                    </div>

                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />

        <SidebarGroup>
          <SidebarMenu>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger render={
                  <SidebarMenuButton tooltip="Enrolled">
                    <School className="size-4" />
                    <span>Enrolled</span>
                    <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                } />
                <CollapsibleContent>
                  <SidebarMenuSub className="mt-1">
                    {enrolledClassrooms.length === 0 ? (
                      <SidebarMenuSubItem>
                        <span className="text-xs text-zinc-500 italic px-2 py-1">No enrolled classes</span>
                      </SidebarMenuSubItem>
                    ) : (
                      enrolledClassrooms.map((item) => {
                        const cls = item.classroom || item;
                        const classUrl = `/dashboard/classroom/${cls.id}`;
                        return (
                          <SidebarMenuSubItem key={cls.id}>
                            <SidebarMenuSubButton
                              isActive={isActive(classUrl)}
                              render={<a href={classUrl} />}
                              className="!flex !items-center !gap-2 !h-8 !px-2 group"
                            >
                              <School className="!size-3.5 !text-zinc-400 group-hover:!text-zinc-100 !opacity-100 !block shrink-0 transition-colors duration-200" />
                              <span className="truncate">{String(cls.className).toUpperCase()}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarMenu>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger render={
                  <SidebarMenuButton tooltip="Teaching">
                    <BookOpen className="size-4" />
                    <span>Teaching</span>
                    <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                } />
                <CollapsibleContent>
                  <SidebarMenuSub className="mt-1">
                    {teachingClassrooms.length === 0 ? (
                      <SidebarMenuSubItem>
                        <span className="text-xs text-zinc-500 italic px-2 py-1">No teaching classes</span>
                      </SidebarMenuSubItem>
                    ) : (
                      teachingClassrooms.map((cls) => {
                        const classUrl = `/dashboard/classroom/${cls.id}`;
                        return (
                          <SidebarMenuSubItem key={cls.id}>
                            <SidebarMenuSubButton
                              isActive={isActive(classUrl)}
                              render={<a href={classUrl} />}
                              className="!flex !items-center !gap-2 !h-8 !px-2 group"
                            >
                              <BookOpen className="!size-3.5 !text-zinc-400 group-hover:!text-zinc-100 !opacity-100 !block shrink-0 transition-colors duration-200" />
                              <span className="truncate">{String(cls.className).toUpperCase()}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
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