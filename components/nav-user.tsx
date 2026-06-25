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
              <SidebarMenuButton size="lg" className="cursor-pointer" />
            }
          >
            <Avatar className="size-8 rounded-lg">
              {isUrlAvatar ? (
                <>
                  <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                  <AvatarFallback className="rounded-lg">{classphoto(user.name)}</AvatarFallback>
                </>
              ) : (
                <AvatarFallback className="rounded-lg">{user.avatar}</AvatarFallback>
              )}
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight hover:text-black">
              <span className="truncate font-medium ">{user.name}</span>
              <span className="truncate text-xs ">{user.email}</span>
            </div>
            <EllipsisVerticalIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 "
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div
                  className="flex items-center gap-2 px-1 py-1.5 text-left text-sm cursor-pointer"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditphoto(true)
                  }}
                >
                  <Avatar className="size-8 rounded-lg">
                    {isUrlAvatar ? (
                      <>
                        <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                        <AvatarFallback className="rounded-lg">{classphoto(user.name)}</AvatarFallback>
                      </>
                    ) : (
                      <AvatarFallback className="rounded-lg">{user.avatar}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium text-black">{user.name}</span>
                    <span className="truncate text-xs text-black/60">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                const ans = confirm("Do you want to sign out?")
                if (ans) signOut()
              }}
            >
              <LogOutIcon />
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