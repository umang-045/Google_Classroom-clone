"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
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

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-xs'
            onClick={() => setCreateAnnouncementBox(false)}
        >
            <div
                style={{ background: 'linear-gradient(to top, #27272a, #151519)' }}
                className='relative w-full max-w-xl rounded-xl border border-zinc-800/80 p-8 shadow-2xl space-y-7 animate-in fade-in-50 zoom-in-95 duration-150 text-zinc-200'
                onClick={(e) => e.stopPropagation()}
            >
               
                <button
                    onClick={() => setCreateAnnouncementBox(false)}
                    className='absolute top-5 right-5 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors'
                >
                    <X size={20} />
                </button>

              
                <div className='flex items-center gap-4 pl-0.5'>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800/70 text-amber-400 border border-zinc-700/60 shadow-inner'>
                        <Megaphone size={22} />
                    </div>
                    <div>
                        <h3 className='font-semibold text-2xl tracking-tight text-white'>
                            Create Announcement
                        </h3>
                        <p className='text-xs text-zinc-400 mt-1'>
                            Post an announcement or update to your class
                        </p>
                    </div>
                </div>

           
                <div className='space-y-5'>
                    <div className='w-full space-y-2'>
                        <Label htmlFor='title' className='text-zinc-300 text-sm font-medium pl-0.5'>
                            Title <span className='text-rose-500'>*</span>
                        </Label>
                        <Input
                            id='title'
                            type='text'
                            placeholder='Announcement title'
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className='w-full h-11 rounded-md border-zinc-700 bg-zinc-900/40 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-500'
                        />
                    </div>

                    <div className='w-full space-y-2'>
                        <Label htmlFor='content' className='text-zinc-300 text-sm font-medium pl-0.5'>
                            Content <span className='text-rose-500'>*</span>
                        </Label>
                        <textarea
                            id='content'
                            placeholder='Write your announcement here...'
                            required
                            rows={4}
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            className='flex min-h-[110px] w-full rounded-md border border-zinc-700 bg-zinc-900/40 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none resize-none focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-500'
                        />
                    </div>
                </div>

              
                <div className='flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/60 max-sm:flex-col-reverse'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() => setCreateAnnouncementBox(false)}
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
                        {loading ? 'Posting...' : 'Post'}
                    </Button>
                </div>
            </div>
        </div>
    )
}