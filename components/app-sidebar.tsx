"use client"
import * as React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
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
  HelpCircle,
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
    { title: "Get Help", url: "/#faqs", icon: HelpCircle },
    { title: "Contact Us", url: "/#contact", icon: HelpCircle },
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

  const activePillStyles = `
    !bg-gradient-to-r !from-[#1d1f27] !to-[#14161d] 
    !text-white font-semibold border border-white/[0.08] 
    shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_8px_16px_-6px_rgba(0,0,0,0.5)] 
    [&_svg]:!text-blue-400 [&_svg]:!opacity-100 scale-[1.02]
  `.trim();

  return (
    <Sidebar 
      collapsible="icon" 
      {...props}
      className="tracking-wide text-zinc-300 bg-[#111217] border-r border-white/[0.08]"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="/dashboard" />}
            >
              <span className="text-base font-bold mt-2 tracking-wider">
                <span className="text-white text-2xl font-extrabold">Digital</span>
                <span className="text-blue-500 text-2xl font-extrabold">Classroom</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="mt-5 tracking-wide px-2 flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="tracking-widest uppercase text-[10px] text-zinc-500 font-bold px-3 mb-1">General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <AIChatButton
                  trigger={(onClick) => (
                    <SidebarMenuButton onClick={onClick} className="tracking-wide text-zinc-400 hover:text-white cursor-pointer transition-colors duration-200 hover:bg-white/[0.02]">
                      <Sparkles className="text-blue-400/80" />
                      <span>Ask AI</span>
                    </SidebarMenuButton>
                  )}
                />
              </SidebarMenuItem>

              {data.general.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      isActive={active} 
                      render={<a href={item.url} />} 
                      className={`tracking-wide transition-all duration-300 rounded-xl px-3 h-10 cursor-pointer ${
                        active 
                          ? activePillStyles 
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
                      }`}
                    >
                      <item.icon className="size-4 transition-transform duration-200 group-hover:scale-105" />
                      <div className="flex items-center justify-between w-full">
                        <span>{item.title}</span>
                        {item.title === "Notifications" && unreadCount > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[11px] font-bold text-white shadow-sm shadow-blue-500/20">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2 bg-white/[0.04]" />

        <SidebarGroup>
          <SidebarMenu>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger render={
                  <SidebarMenuButton tooltip="Enrolled" className="tracking-wide text-zinc-400 hover:text-white px-3 cursor-pointer hover:bg-white/[0.02]">
                    <School className="size-4 text-zinc-500 group-hover:text-zinc-300" />
                    <span>Enrolled</span>
                    <ChevronRight className="ml-auto size-4 transition-transform duration-200 text-zinc-500 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                } />
                <CollapsibleContent>
                  <SidebarMenuSub className="mt-1 ml-4 border-l border-white/[0.06] pl-2 gap-1 flex flex-col">
                    {enrolledClassrooms.length === 0 ? (
                      <SidebarMenuSubItem>
                        <span className="text-xs text-zinc-600 italic px-3 py-1.5 tracking-wide">No enrolled classes</span>
                      </SidebarMenuSubItem>
                    ) : (
                      enrolledClassrooms.map((item) => {
                        const cls = item.classroom || item;
                        const classUrl = `/dashboard/classroom/${cls.id}`;
                        const active = isActive(classUrl);
                        return (
                          <SidebarMenuSubItem key={cls.id}>
                            <SidebarMenuSubButton
                              isActive={active}
                              render={<a href={classUrl} />}
                              className={`!flex !items-center !gap-2.5 !h-9 !px-3 tracking-wide rounded-xl transition-all duration-300 cursor-pointer group ${
                                active 
                                  ? activePillStyles 
                                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
                              }`}
                            >
                              <School className="!size-3.5 transition-colors duration-200 shrink-0 text-zinc-500 group-hover:text-zinc-300" />
                              <span className="truncate tracking-wide text-xs">{String(cls.className).toUpperCase()}</span>
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

        <SidebarSeparator className="my-2 bg-white/[0.04]" />

        <SidebarGroup>
          <SidebarMenu>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger render={
                  <SidebarMenuButton tooltip="Teaching" className="tracking-wide text-zinc-400 hover:text-white px-3 cursor-pointer hover:bg-white/[0.02]">
                    <BookOpen className="size-4 text-zinc-500 group-hover:text-zinc-300" />
                    <span>Teaching</span>
                    <ChevronRight className="ml-auto size-4 transition-transform duration-200 text-zinc-500 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                } />
                <CollapsibleContent>
                  <SidebarMenuSub className="mt-1 ml-4 border-l border-white/[0.06] pl-2 gap-1 flex flex-col">
                    {teachingClassrooms.length === 0 ? (
                      <SidebarMenuSubItem>
                        <span className="text-xs text-zinc-600 italic px-3 py-1.5 tracking-wide">No teaching classes</span>
                      </SidebarMenuSubItem>
                    ) : (
                      teachingClassrooms.map((cls) => {
                        const classUrl = `/dashboard/classroom/${cls.id}`;
                        const active = isActive(classUrl);
                        return (
                          <SidebarMenuSubItem key={cls.id}>
                            <SidebarMenuSubButton
                              isActive={active}
                              render={<a href={classUrl} />}
                              className={`!flex !items-center !gap-2.5 !h-9 !px-3 tracking-wide rounded-xl transition-all duration-300 cursor-pointer group ${
                                active 
                                  ? activePillStyles 
                                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
                              }`}
                            >
                              <BookOpen className="!size-3.5 transition-colors duration-200 shrink-0 text-zinc-500 group-hover:text-zinc-300" />
                              <span className="truncate tracking-wide text-xs">{String(cls.className).toUpperCase()}</span>
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
      </SidebarContent>

      {/* Styled Footer Container matching image theme */}
      <SidebarFooter className="tracking-wide p-2 border-t border-white/[0.06] flex flex-col gap-1">
        {/* Help & Support Actions */}
        <SidebarMenu className="gap-0.5">
          {data.navSecondary.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                render={<a href={item.url} />}
                className="text-zinc-400 hover:text-white hover:bg-white/[0.03] text-sm h-9 px-3 rounded-lg transition-colors cursor-pointer"
                tooltip={item.title}
              >
                <item.icon className="size-4 text-zinc-400" />
                <span className="text-xs font-medium">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/* User Card */}
        <div className="pt-1 mt-1 border-t border-white/[0.04]">
          <NavUser user={data.user} onAvatarChange={setAvatarOverride} />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}