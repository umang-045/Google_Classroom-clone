"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { Link, X } from 'lucide-react'

interface JoinClassForm {
    joinCode: string
}

interface JoinClassProps {
    setjoinclassBox: (val: boolean) => void
}

export default function JoinClass({ setjoinclassBox }: JoinClassProps) {
    const router = useRouter()
    const [form, setForm] = useState<JoinClassForm>({ joinCode: "" })
    const [loading, setLoading] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/classroom/joinclass", {
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

            toast.success("Joined classroom!")
            setjoinclassBox(false)
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
            onClick={() => setjoinclassBox(false)}
        >
            <div
                style={{ background: 'linear-gradient(to top, #27272a, #151519)' }}
                className='relative w-full max-w-xl rounded-xl border border-zinc-800/80 p-8 shadow-2xl space-y-7 animate-in fade-in-50 zoom-in-95 duration-150 text-zinc-200'
                onClick={(e) => e.stopPropagation()}
            >
              
                <button
                    type='button'
                    onClick={() => setjoinclassBox(false)}
                    className='absolute top-5 right-5 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors'
                >
                    <X size={20} />
                </button>

               
                <div className='flex items-center gap-4 pl-0.5'>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800/70 text-indigo-400 border border-zinc-700/60 shadow-inner'>
                        <Link size={22} />
                    </div>
                    <div>
                        <h3 className='font-semibold text-2xl tracking-tight text-white'>
                            Join Classroom
                        </h3>
                        <p className='text-xs text-zinc-400 mt-1'>
                            Enter a valid invitation token to connect with your group
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className='space-y-7'>
                    <div className='w-full space-y-2'>
                        <Label htmlFor='joinCode' className='text-zinc-300 text-sm font-medium pl-0.5'>
                            Class Join Code <span className='text-rose-500'>*</span>
                        </Label>
                        <Input
                            id='joinCode'
                            type='text'
                            name='joinCode'
                            placeholder='Enter your join-code here...'
                            minLength={8}
                            required
                            value={form.joinCode}
                            onChange={(e) => setForm({ joinCode: e.target.value })}
                            className='w-full h-11 rounded-md border-zinc-700 bg-zinc-900/40 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-500'
                        />
                    </div>

                  
                    <div className='flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/60 max-sm:flex-col-reverse'>
                        <Button
                            type='button'
                            variant='ghost'
                            onClick={() => setjoinclassBox(false)}
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
                            {loading ? 'Please Wait...' : 'Join'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}