"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface ScheduleMeetingProps {
    classroomId: number
    setScheduleMeetingBox: (val: boolean) => void
    onSuccess: () => void
}

export default function ScheduleMeeting({ classroomId, setScheduleMeetingBox, onSuccess }: ScheduleMeetingProps) {
    const [form, setForm] = useState({ title: "", scheduled_at: "" })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!form.title || !form.scheduled_at) {
            setError("Title and scheduled_at are required.")
            return
        }
        setLoading(true)
        setError("")
        setSuccess("")

        const res = await fetch(`/api/meetings/${classroomId}`, {
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

        setSuccess("Meeting Scheduled!")
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
                            onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                        />
                    </div>

                    {error && <p className='text-destructive text-sm'>{error}</p>}
                    {success && <p className='text-green-600 text-sm'>{success}</p>}
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