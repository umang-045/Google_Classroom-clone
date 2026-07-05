"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Video, X } from 'lucide-react'

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
            toast.error("Title and schedule time are required.")
            return
        }
        const selectedDate = new Date(form.scheduled_at)
        if (selectedDate <= new Date()) {
            toast.error("Scheduled date and time must be in the future.")
            return
        }

        setLoading(true)
        try {
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
        } catch (err) {
            console.error(err)
            toast.error("Network error. Please try again.")
            setLoading(false)
        }
    }

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-xs'
            onClick={() => setScheduleMeetingBox(false)}
        >
            <div
                style={{ background: 'linear-gradient(to top, #27272a, #151519)' }}
                className='relative w-full max-w-xl rounded-xl border border-zinc-800/80 p-8 shadow-2xl space-y-7 animate-in fade-in-50 zoom-in-95 duration-150 text-zinc-200'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={() => setScheduleMeetingBox(false)}
                    className='absolute top-5 right-5 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors'
                >
                    <X size={20} />
                </button>

                {/* Header Section */}
                <div className='flex items-center gap-4 pl-0.5'>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800/70 text-emerald-400 border border-zinc-700/60 shadow-inner'>
                        <Video size={22} />
                    </div>
                    <div>
                        <h3 className='font-semibold text-2xl tracking-tight text-white'>
                            Schedule Meeting
                        </h3>
                        <p className='text-xs text-zinc-400 mt-1'>
                            Set up a live interaction session for your class
                        </p>
                    </div>
                </div>

                {/* Form Fields */}
                <div className='space-y-5'>
                    <div className='w-full space-y-2'>
                        <Label htmlFor='title' className='text-zinc-300 text-sm font-medium pl-0.5'>
                            Title <span className='text-rose-500'>*</span>
                        </Label>
                        <Input
                            id='title'
                            type='text'
                            placeholder='Meeting title'
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className='w-full h-11 rounded-md border-zinc-700 bg-zinc-900/40 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-500'
                        />
                    </div>

                    <div className='w-full space-y-2'>
                        <Label htmlFor='scheduled_at' className='text-zinc-300 text-sm font-medium pl-0.5'>
                            Schedule Time <span className='text-rose-500'>*</span>
                        </Label>
                        <Input
                            id='scheduled_at'
                            type='datetime-local'
                            required
                            value={form.scheduled_at}
                            min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                            onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                            className='w-full h-11 flex items-center rounded-md border-zinc-700 bg-zinc-900/40 text-zinc-100 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-500 colored-scheme-dark'
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div className='flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/60 max-sm:flex-col-reverse'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() => setScheduleMeetingBox(false)}
                        disabled={loading}
                        className='rounded-md px-5 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white border-0 text-xs h-10 max-sm:w-full'
                    >
                        Cancel
                    </Button>
                    <Button
                        type='button'
                        onClick={handleSubmit}
                        disabled={loading}
                        className='rounded-md cursor-pointer px-5 bg-blue-700 hover:bg-blue-800 text-white font-medium border-0 text-xs h-10 max-sm:w-full'
                    >
                        {loading ? 'Scheduling...' : 'Schedule'}
                    </Button>
                </div>
            </div>
        </div>
    )
}