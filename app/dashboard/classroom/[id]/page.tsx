"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import CreateAnnouncement from '@/app/components/Announcement/CreateAnnouncement'
import { AnnouncementCard } from '@/app/components/Announcement/AnnouncementCard'
import { Loader2 } from 'lucide-react'

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
    const [error, setError] = useState("")
    const [createAnnouncementBox, setCreateAnnouncementBox] = useState(false)

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch(`/api/announcements/${classroomId}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Failed to load announcements")
            setAnnouncements(data.allAnnouncement)
        } catch (err: any) {
            setError(err.message || "Something went wrong")
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
            fetchAnnouncements()
        } catch (err: any) {
            alert(err.message || "Something went wrong")
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

            {error && <p className='text-center text-destructive mb-4'>{error}</p>}

            {announcements.length > 0 ? (
                <div className='space-y-3'>
                    {announcements.map((item) => (
                        <AnnouncementCard
                            key={item.id}
                            announcement={item}
                            role={role}
                            onDelete={handleDelete}
                            deleteLoading={deleteLoading}
                        />
                    ))}
                </div>
            ) : (
                !error && <p className='text-center text-white/50 py-12'>No announcements published here yet.</p>
            )}
        </div>
    )
}

export default Page
