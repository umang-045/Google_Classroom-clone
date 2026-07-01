"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface ScheduleMeetingProps {
    classroomId: number
    setScheduleMeetingBox: (val: boolean) => void
    onSuccess: () => void
}

export default function ScheduleMeeting({ classroomId, setScheduleMeetingBox, onSuccess }: ScheduleMeetingProps) {
    const [form, setForm] = useState({ title: "", scheduled_at: "" })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!form.title || !form.scheduled_at) {
            toast.error("Title and scheduled_at are required.")
            return
        }
        const selectedDate = new Date(form.scheduled_at)
        if (selectedDate <= new Date()) {
            toast.error("Scheduled date and time must be in the future.")
            return
        }

        setLoading(true)
        const res = await fetch(`/api/meetings/${classroomId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
        const data = await res.json()
        if (!res.ok) {
            toast.error(data.message || "Something went wrong.")
            setLoading(false)
            return
        }
        toast.success("Meeting Scheduled!")
        setLoading(false)
        setTimeout(() => {
            setScheduleMeetingBox(false)
            onSuccess()
        }, 800)
    }

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
            onClick={() => setScheduleMeetingBox(false)}
        >
            <Card className='w-full max-w-lg bg-white' onClick={(e) => e.stopPropagation()}>
                <CardHeader>
                    <CardTitle className='font-semibold'>Schedule Meeting</CardTitle>
                    <CardDescription>Schedule a Meeting for your class</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                        <label htmlFor='title'>Title <span className='text-destructive'>*</span></label>
                        <Input
                            id='title'
                            placeholder='Meeting title'
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>
                    <div className='w-full space-y-2'>
                        <label htmlFor='scheduled_at'>scheduled_at <span className='text-destructive'>*</span></label>
                        <Input
                            id='scheduled_at'
                            type='datetime-local'
                            value={form.scheduled_at}
                            min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                            onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                        />
                    </div>
                </CardContent>
                <CardContent className='flex justify-end gap-2'>
                    <Button variant='outline' onClick={() => setScheduleMeetingBox(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Scheduling..." : "Schedule"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}