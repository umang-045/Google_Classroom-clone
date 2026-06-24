"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface CreateAnnouncementProps {
    classroomId: number
    setCreateAnnouncementBox: (val: boolean) => void
    onSuccess: () => void
}

export default function CreateAnnouncement({ classroomId, setCreateAnnouncementBox, onSuccess }: CreateAnnouncementProps) {
    const [form, setForm] = useState({ title: "", content: "" })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!form.title || !form.content) {
            setError("Title and content are required.")
            return
        }
        setLoading(true)
        setError("")
        setSuccess("")

        const res = await fetch(`/api/announcements/${classroomId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
        const data = await res.json()

        if (!res.ok) {
            setError(data.message || "Something went wrong.")
            setLoading(false)
            return
        }

        setSuccess("Announcement posted!")
        setLoading(false)
        setTimeout(() => {
            setCreateAnnouncementBox(false)
            onSuccess()
        }, 800)
    }

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
            onClick={() => setCreateAnnouncementBox(false)}
        >
            <Card className='w-full max-w-lg bg-white' onClick={(e) => e.stopPropagation()}>
                <CardHeader>
                    <CardTitle className='font-semibold'>Create Announcement</CardTitle>
                    <CardDescription>Post an announcement to your class</CardDescription>
                </CardHeader>

                <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                        <label htmlFor='title'>Title <span className='text-destructive'>*</span></label>
                        <Input
                            id='title'
                            placeholder='Announcement title'
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>
                    <div className='w-full space-y-2'>
                        <label htmlFor='content'>Content <span className='text-destructive'>*</span></label>
                        <textarea
                            id='content'
                            placeholder='Write your announcement here...'
                            rows={4}
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                             className='border-input flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none resize-none focus-visible:ring-1 focus-visible:ring-ring'
                        />
                    </div>

                    {error && <p className='text-destructive text-sm'>{error}</p>}
                    {success && <p className='text-green-600 text-sm'>{success}</p>}
                </CardContent>

                <CardContent className='flex justify-end gap-2'>
                    <Button variant='outline' onClick={() => setCreateAnnouncementBox(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Posting..." : "Post"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}