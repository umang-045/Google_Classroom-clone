"use client"
import React, { useState } from 'react'
import { MoreVertical, Loader2 } from 'lucide-react' 
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface ClassroomMenuProp {
    joinCode: string,
    id: number,
    role: string
}

const ClassroomMenu = ({ joinCode, id, role }: ClassroomMenuProp) => {
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [isLeaving, setIsLeaving] = useState<boolean>(false)
    const router = useRouter()

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        const confirmed = confirm("Are you sure? This cannot be undone.")
        if (!confirmed) return

        setIsDeleting(true)
        try {
            const res = await fetch("/api/classroom/deleteclass", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classroomId: id })
            })
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Try Again")
                setIsDeleting(false)
                return
            }
            toast.success("Classroom deleted")
            router.push('/dashboard/allclasses')
        } catch (err) {
            console.error(err)
            toast.error("Something went wrong")
            setIsDeleting(false)
        }
    }

    const handleLeave = async (e: React.MouseEvent) => {
        e.stopPropagation()
        const confirmed = confirm("Are you sure? This cannot be undone.")
        if (!confirmed) return

        setIsLeaving(true)
        try {
            const res = await fetch("/api/classroom/leaveclass", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classroomId: id })
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.message || "Try Again")
                setIsLeaving(false)
                return
            }
            toast.success("You left the classroom")
            router.push('/dashboard/allclasses')
        } catch (err) {
            console.error(err)
            toast.error("Something went wrong")
            setIsLeaving(false)
        }
    }

    const handleCopyJoinCode = (e: React.MouseEvent) => {
        e.stopPropagation()
        navigator.clipboard.writeText(joinCode)
        toast.success("Join code copied")
    }

    const isActionLoading = isDeleting || isLeaving

    return (
        <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} disabled={isActionLoading}>
                <div className="h-8 w-8 text-white hover:bg-white/20 rounded-md flex items-center justify-center cursor-pointer" >
                    {isActionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                    ) : (
                        <MoreVertical className="h-4 w-4" />
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleCopyJoinCode} disabled={isActionLoading}> 
                        Copy Join Code 
                    </DropdownMenuItem>
                    
                    {role === "teacher" ? (
                        <DropdownMenuItem 
                            className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer flex items-center gap-2" 
                            onClick={handleDelete}
                            disabled={isActionLoading}
                        >
                            {isDeleting && <Loader2 className="h-3 w-3 animate-spin" />}
                            Delete Class
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem 
                            className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer flex items-center gap-2" 
                            onClick={handleLeave}
                            disabled={isActionLoading}
                        >
                            {isLeaving && <Loader2 className="h-3 w-3 animate-spin" />}
                            Leave Class
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ClassroomMenu