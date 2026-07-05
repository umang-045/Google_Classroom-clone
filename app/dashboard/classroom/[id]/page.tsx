"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import CreateAnnouncement from '@/app/components/Announcement/CreateAnnouncement'
import { AnnouncementCard } from '@/app/components/Announcement/AnnouncementCard'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Announcement {
    id: number
    title: string
    content: string
    created_at: string
}

const Page = () => {
    const params = useParams()
    const classroomId = params.id as string

    const [role, setRole] = useState<string>("")
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [loadFailed, setLoadFailed] = useState<boolean>(false)
    const [createAnnouncementBox, setCreateAnnouncementBox] = useState(false)

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch(`/api/announcements/${classroomId}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Failed to load announcements")
            setAnnouncements(data.allAnnouncement)
            setLoadFailed(false)
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong"
            toast.error(message)
            setLoadFailed(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const res = await fetch(`/api/classroom/${classroomId}/role`)
                const data = await res.json()
                if (!res.ok) throw new Error(data.message || "Failed to load role")
                setRole(data.role)
            } catch (err) {
                console.log(err)
            }
        }
        fetchRole()
        fetchAnnouncements()
    }, [classroomId])

    const handleDelete = async (announcementId: number) => {
        if (!confirm("Delete this announcement?")) return
        setDeleteLoading(true)
        try {
            const res = await fetch(`/api/announcements/${classroomId}/${announcementId}`, {
                method: "DELETE",
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Delete failed")
            toast.success("Announcement deleted")
            fetchAnnouncements()
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong"
            toast.error(message)
        } finally {
            setDeleteLoading(false)
        }
    }

    if (loading) return <div className="flex items-center justify-center min-h-[75vh]">
        <Loader2 className="size-6 animate-spin text-gray-400" />
    </div>

    return (
        <div className='py-4 px-2 sm:px-4'>
            {role === "teacher" && (
                <div className='flex justify-end mb-6'>
                    <Button onClick={() => setCreateAnnouncementBox(true)}>
                        + Create Announcement
                    </Button>
                    {createAnnouncementBox && (
                        <CreateAnnouncement
                            classroomId={Number(classroomId)}
                            setCreateAnnouncementBox={(val: boolean) => {
                                setCreateAnnouncementBox(val)
                            }}
                            onSuccess={fetchAnnouncements}
                        />
                    )}
                </div>
            )}

            {announcements.length > 0 ? (
                <div className='space-y-3'>
                    {announcements.map((item) => (
                        <AnnouncementCard
                            classroomId={Number(classroomId)}
                            key={item.id}
                            announcement={item}
                            role={role}
                            onDelete={handleDelete}
                            deleteLoading={deleteLoading}
                        />
                    ))}
                </div>
            ) : (
                <p className='text-center text-white/50 py-12'>
                    {loadFailed ? "Couldn't load announcements. Try refreshing." : "No announcements published here yet."}
                </p>
            )}
        </div>
    )
}

export default Page