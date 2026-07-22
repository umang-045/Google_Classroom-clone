"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
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
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

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

    const modalContent = (
        <div
            className='fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm'
            onClick={() => setScheduleMeetingBox(false)}
        >
            <div
                style={{ background: 'linear-gradient(180deg, #13141a 0%, #0c0d12 100%)' }}
                className='relative w-full max-w-xl rounded-2xl border border-zinc-800/90 p-8 shadow-2xl space-y-7 animate-in fade-in-50 zoom-in-95 duration-150 text-zinc-200'
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => setScheduleMeetingBox(false)}
                    className='absolute top-6 right-6 text-zinc-400 hover:text-rose-400 cursor-pointer transition-colors p-1'
                >
                    <X size={20} />
                </button>

                <div className='flex items-center gap-4 pl-0.5'>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900/80 border border-zinc-700/60 text-sky-400 shadow-sm'>
                        <Video size={22} className='text-sky-400' />
                    </div>
                    <div>
                        <h3 className='font-bold text-2xl tracking-tight text-white'>
                            Schedule Meeting
                        </h3>
                        <p className='text-xs text-zinc-400 mt-1 font-normal'>
                            Set up a live interaction session for your class
                        </p>
                    </div>
                </div>

   
                <div className='space-y-5'>
                    <div className='w-full space-y-2'>
                        <Label htmlFor='title' className='text-zinc-300 text-xs font-semibold uppercase tracking-wider pl-0.5'>
                            Title <span className='text-rose-500'>*</span>
                        </Label>
                        <Input
                            id='title'
                            type='text'
                            placeholder='e.g. Weekly Q&A Session'
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className='w-full h-11 rounded-xl border-zinc-800 bg-zinc-900/60 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-sky-500 focus-visible:border-sky-500 text-sm transition-all'
                        />
                    </div>

                    <div className='w-full space-y-2'>
                        <Label htmlFor='scheduled_at' className='text-zinc-300 text-xs font-semibold uppercase tracking-wider pl-0.5'>
                            Schedule Time <span className='text-rose-500'>*</span>
                        </Label>
                        <Input
                            id='scheduled_at'
                            type='datetime-local'
                            required
                            value={form.scheduled_at}
                            min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                            onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                            className='w-full h-11 flex items-center rounded-xl border-zinc-800 bg-zinc-900/60 text-zinc-100 focus-visible:ring-1 focus-visible:ring-sky-500 focus-visible:border-sky-500 text-sm colored-scheme-dark transition-all'
                        />
                    </div>
                </div>

               
                <div className='flex items-center justify-end gap-3 pt-5 border-t border-zinc-800/80 max-sm:flex-col-reverse'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() => setScheduleMeetingBox(false)}
                        disabled={loading}
                        className='rounded-xl px-5 bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-700/50 text-xs h-10 font-medium max-sm:w-full cursor-pointer transition-all'
                    >
                        Cancel
                    </Button>
                    <Button
                        type='button'
                        onClick={handleSubmit}
                        disabled={loading}
                        className='rounded-xl cursor-pointer px-6 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs h-10 shadow-md shadow-sky-950/50 max-sm:w-full transition-all'
                    >
                        {loading ? 'Scheduling...' : 'Schedule Meeting'}
                    </Button>
                </div>
            </div>
        </div>
    )

    if (!mounted) return null

    return createPortal(modalContent, document.body)
}