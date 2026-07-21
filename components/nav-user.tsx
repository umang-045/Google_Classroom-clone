"use client"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { EllipsisVerticalIcon, LogOutIcon } from "lucide-react"
import { signOut } from "next-auth/react"
import { classphoto } from "@/app/components/ClassroomCard"
import { useState } from "react"
import EditPhoto from "@/app/components/EditPhoto"

export function NavUser({
  user,
  onAvatarChange,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  onAvatarChange: (url: string) => void
}) {
  const { isMobile } = useSidebar()
  const isUrlAvatar = user.avatar.startsWith("http")
  const [editphoto, setEditphoto] = useState(false)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton 
                size="lg" 
                className="cursor-pointer text-white hover:bg-white/[0.04] transition-colors" 
              />
            }
          >
            <Avatar className="size-8 rounded-lg shrink-0">
              {isUrlAvatar ? (
                <>
                  <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                  <AvatarFallback className="rounded-lg bg-blue-600 text-white font-semibold text-xs">
                    {classphoto(user.name)}
                  </AvatarFallback>
                </>
              ) : (
                <AvatarFallback className="rounded-lg bg-blue-600 text-white font-semibold text-xs">
                  {user.avatar}
                </AvatarFallback>
              )}
            </Avatar>
            
            {/* Sidebar User Info */}
            <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
              <span className="truncate font-medium text-white">{user.name}</span>
              <span className="truncate text-xs text-zinc-400">{user.email}</span>
            </div>
            <EllipsisVerticalIcon className="ml-auto size-4 text-zinc-400 shrink-0" />
          </DropdownMenuTrigger>

          {/* Dropdown Content */}
          <DropdownMenuContent
            className="min-w-56 rounded-xl bg-[#111217] border border-white/[0.1] text-white p-1.5 shadow-2xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div
                  className="flex items-center gap-3 px-2 py-2 text-left text-sm cursor-pointer rounded-lg hover:bg-white/[0.04] transition-colors"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditphoto(true)
                  }}
                >
                  <Avatar className="size-8 rounded-lg shrink-0 border border-white/10">
                    {isUrlAvatar ? (
                      <>
                        <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                        <AvatarFallback className="rounded-lg bg-blue-600 text-white font-semibold text-xs">
                          {classphoto(user.name)}
                        </AvatarFallback>
                      </>
                    ) : (
                      <AvatarFallback className="rounded-lg bg-blue-600 text-white font-semibold text-xs">
                        {user.avatar}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* Dropdown Header User Info: Fixed Text Colors */}
                  <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                    <span className="truncate font-semibold text-white text-sm">
                      {user.name}
                    </span>
                    <span className="truncate text-xs text-zinc-400">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1 bg-white/[0.08]" />

            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2.5 py-2 text-xs text-zinc-200 focus:bg-white/[0.08] focus:text-white transition-colors"
              onClick={() => {
                const ans = confirm("Do you want to sign out?")
                if (ans) signOut()
              }}
            >
              <LogOutIcon className="mr-2 size-4 text-zinc-400" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {editphoto && (
        <EditPhoto
          currentAvatar={user.avatar}
          onClose={() => setEditphoto(false)}
          onSuccess={onAvatarChange}
        />
      )}
    </SidebarMenu>
  )
}