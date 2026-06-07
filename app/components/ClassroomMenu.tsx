"use client"
import React, { useState } from 'react'
import { MoreVertical } from 'lucide-react'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'

interface ClassroomMenuProp {
    joinCode: string,
    id: number,
    role: string
}

const ClassroomMenu = ({ joinCode, id, role }: ClassroomMenuProp) => {
    const [error, setError] = useState<string>("")
    const router = useRouter()
    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        const confirmed = confirm("Are you sure? This cannot be undone.")
        if (!confirmed) {
            return
        }
        const res = await fetch("/api/classroom/deleteclass", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ classroomId: id })
        })
        const data = await res.json();
        if (!res.ok) {
            return setError(data.message || "Try Again ")
        }
        router.push('/dashboard/allclasses')

    }
    const handleLeave = async (e: React.MouseEvent) => {
        e.stopPropagation()
        const confirmed = confirm("Are you sure? This cannot be undone.")
        if (!confirmed) {
            return
        }
        const res = await fetch("/api/classroom/leaveclass", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ classroomId: id })
        })
        const data = await res.json()
        if (!res.ok) {
            return setError(data.message || "Try Again")
        }
        router.push('/dashboard/allclasses')

    }
    const handleCopyJoinCode = (e: React.MouseEvent) => { 
        e.stopPropagation()
        navigator.clipboard.writeText(joinCode) 
        alert("Join Code Copied ")    
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                <div className="h-8 w-8 text-white hover:bg-white/20 rounded-md flex items-center justify-center cursor-pointer" >
                    <MoreVertical className="h-4 w-4" />
                </div>
            </DropdownMenuTrigger>
            < DropdownMenuContent align="end" >
                <DropdownMenuGroup>
                    < DropdownMenuItem onClick={handleCopyJoinCode} > Copy Join Code </DropdownMenuItem>
                    {role === "teacher" ? < DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer" onClick={handleDelete}> Delete Class</DropdownMenuItem> : < DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer" onClick={handleLeave}> Leave Class</DropdownMenuItem>}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}
export default ClassroomMenu