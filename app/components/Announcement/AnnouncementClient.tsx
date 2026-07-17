"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import CreateAnnouncement from '@/app/components/Announcement/CreateAnnouncement'
import { AnnouncementCard } from '@/app/components/Announcement/AnnouncementCard'
import toast from 'react-hot-toast'

interface Announcement {
    id: number
    title: string
    content: string
    created_at: string
}

interface AnnouncementsClientProps {
    classroomId: string
    initialRole: string
    initialAnnouncements: Announcement[]
}

const AnnouncementsClient = ({ classroomId, initialRole, initialAnnouncements }: AnnouncementsClientProps) => {
    const [role] = useState<string>(initialRole)
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
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
        }
    }

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
                <p className='text-center text-white/50 py-12 px-4'>
                    {loadFailed ? "Couldn't load announcements. Try refreshing." : "No announcements published here yet."}
                </p>
            )}
        </div>
    )
}

export default AnnouncementsClient