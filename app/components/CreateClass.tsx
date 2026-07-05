"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { PlusCircle, X } from 'lucide-react'

interface CreateClassForm {
    className: string
    semester: string
    section: string
    description: string
}

interface CreateClassProps {
    setcreateclassBox: (val: boolean) => void
}

export default function CreateClass({ setcreateclassBox }: CreateClassProps) {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [form, setForm] = useState<CreateClassForm>({ 
        className: "", 
        semester: "", 
        section: "", 
        description: "" 
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleCreateClass = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/classroom/createclass", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            })
            const data: { message?: string } = await res.json()
            setLoading(false)

            if (!res.ok) {
                toast.error(data.message || "Try again")
                return
            }

            toast.success("Classroom created!")
            setcreateclassBox(false)
            router.push('/dashboard/allclasses')
        } catch (err) {
            console.error(err)
            toast.error("Network error. Please try again.")
            setLoading(false)
        }
    }

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-xs'
            onClick={() => setcreateclassBox(false)}
        >
            <div
                style={{ background: 'linear-gradient(to top, #27272a, #151519)' }}
                className='relative w-full max-w-xl rounded-xl border border-zinc-800/80 p-8 shadow-2xl space-y-7 animate-in fade-in-50 zoom-in-95 duration-150 text-zinc-200'
                onClick={(e) => e.stopPropagation()}
            >
        
                <button
                    type='button'
                    onClick={() => setcreateclassBox(false)}
                    className='absolute top-5 right-5 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors'
                >
                    <X size={20} />
                </button>

     
                <div className='flex items-center gap-4 pl-0.5'>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800/70 text-violet-400 border border-zinc-700/60 shadow-inner'>
                        <PlusCircle size={22} />
                    </div>
                    <div>
                        <h3 className='font-semibold text-2xl tracking-tight text-white'>
                            Create Classroom
                        </h3>
                        <p className='text-xs text-zinc-400 mt-1'>
                            Set up a new workspace space and manage rosters
                        </p>
                    </div>
                </div>

                <form onSubmit={handleCreateClass} className='space-y-5'>
                    <div className='w-full space-y-2'>
                        <Label htmlFor='className' className='text-zinc-300 text-sm font-medium pl-0.5'>
                            Class Name <span className='text-rose-500'>*</span>
                        </Label>
                        <Input
                            id='className'
                            type='text'
                            name='className'
                            placeholder='e.g., Advanced Software Engineering'
                            required
                            value={form.className}
                            onChange={handleChange}
                            className='w-full h-11 rounded-md border-zinc-700 bg-zinc-900/40 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-500'
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-4 max-sm:grid-cols-1'>
                        <div className='space-y-2'>
                            <Label htmlFor='semester' className='text-zinc-300 text-sm font-medium pl-0.5'>
                                Semester <span className='text-rose-500'>*</span>
                            </Label>
                            <Input
                                id='semester'
                                type='text'
                                name='semester'
                                placeholder='e.g., Fall 2026'
                                required
                                value={form.semester}
                                onChange={handleChange}
                                className='w-full h-11 rounded-md border-zinc-700 bg-zinc-900/40 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-500'
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='section' className='text-zinc-300 text-sm font-medium pl-0.5'>
                                Section <span className='text-rose-500'>*</span>
                            </Label>
                            <Input
                                id='section'
                                type='text'
                                name='section'
                                placeholder='e.g., Section A'
                                required
                                value={form.section}
                                onChange={handleChange}
                                className='w-full h-11 rounded-md border-zinc-700 bg-zinc-900/40 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-500'
                            />
                        </div>
                    </div>

                    <div className='w-full space-y-2'>
                        <Label htmlFor='description' className='text-zinc-300 text-sm font-medium pl-0.5'>
                            Description <span className='text-rose-500'>*</span>
                        </Label>
                        <textarea
                            id='description'
                            name='description'
                            placeholder='Provide class syllabus details or descriptions here...'
                            required
                            rows={3}
                            value={form.description}
                            onChange={handleChange}
                            className='flex min-h-[90px] w-full rounded-md border border-zinc-700 bg-zinc-900/40 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none resize-none focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-500'
                        />
                    </div>

                   
                    <div className='flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/60 max-sm:flex-col-reverse'>
                        <Button
                            type='button'
                            variant='ghost'
                            onClick={() => setcreateclassBox(false)}
                            disabled={loading}
                            className='rounded-md px-5 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white border-0 text-xs h-10 max-sm:w-full'
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={loading}
                            className='rounded-md cursor-pointer px-5 bg-blue-700 hover:bg-blue-800 text-white font-medium border-0 text-xs h-10 max-sm:w-full'
                        >
                            {loading ? 'Please Wait...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}