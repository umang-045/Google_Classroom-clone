"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import { Megaphone, X } from 'lucide-react'

interface CreateAnnouncementProps {
    classroomId: number
    setCreateAnnouncementBox: (val: boolean) => void
    onSuccess: () => void
}

export default function CreateAnnouncement({ classroomId, setCreateAnnouncementBox, onSuccess }: CreateAnnouncementProps) {
    const [form, setForm] = useState({ title: "", content: "" })
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSubmit = async () => {
        if (!form.title || !form.content) {
            toast.error("Title and content are required.")
            return
        }
        
        setLoading(true)

        try {
            const res = await fetch(`/api/announcements/${classroomId}`, {
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

            toast.success("Announcement posted!")
            setLoading(false)
            
            setTimeout(() => {
                setCreateAnnouncementBox(false)
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
            onClick={() => setCreateAnnouncementBox(false)}
        >
            <div
                style={{ background: 'linear-gradient(180deg, #13141a 0%, #0c0d12 100%)' }}
                className='relative w-full max-w-xl rounded-2xl border border-zinc-800/90 p-8 shadow-2xl space-y-7 animate-in fade-in-50 zoom-in-95 duration-150 text-zinc-200'
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => setCreateAnnouncementBox(false)}
                    className='absolute top-6 right-6 text-zinc-400 hover:text-rose-400 cursor-pointer transition-colors p-1'
                >
                    <X size={20} />
                </button>

           
                <div className='flex items-center gap-4 pl-0.5'>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900/80 border border-zinc-700/60 text-sky-400 shadow-sm'>
                        <Megaphone size={22} className='text-sky-400' />
                    </div>
                    <div>
                        <h3 className='font-bold text-2xl tracking-tight text-white'>
                            Create Announcement
                        </h3>
                        <p className='text-xs text-zinc-400 mt-1 font-normal'>
                            Post an announcement or update to your class
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
                            placeholder='e.g. Class Rescheduled'
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className='w-full h-11 rounded-xl border-zinc-800 bg-zinc-900/60 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-sky-500 focus-visible:border-sky-500 text-sm transition-all'
                        />
                    </div>

                    <div className='w-full space-y-2'>
                        <Label htmlFor='content' className='text-zinc-300 text-xs font-semibold uppercase tracking-wider pl-0.5'>
                            Content <span className='text-rose-500'>*</span>
                        </Label>
                        <textarea
                            id='content'
                            placeholder='Write your announcement here...'
                            required
                            rows={4}
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            className='flex min-h-[110px] w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none resize-none focus-visible:ring-1 focus-visible:ring-sky-500 focus-visible:border-sky-500 transition-all'
                        />
                    </div>
                </div>

                <div className='flex items-center justify-end gap-3 pt-5 border-t border-zinc-800/80 max-sm:flex-col-reverse'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() => setCreateAnnouncementBox(false)}
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
                        {loading ? 'Posting...' : 'Post Announcement'}
                    </Button>
                </div>
            </div>
        </div>
    )

    if (!mounted) return null

    return createPortal(modalContent, document.body)
}