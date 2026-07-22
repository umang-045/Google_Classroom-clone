"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Clipboard, X } from 'lucide-react'

interface AssignmentData {
    id?: number
    title: string
    description: string
    due_at: string
    fileUrl?: string
}

function CreateAssignment({ classroomId, setcreateAssignmentBox, editData }: { classroomId: number, setcreateAssignmentBox: (val: boolean) => void, editData?: AssignmentData }) {
    const isEditing = !!editData?.id
    const [createform, setcreateform] = useState({
        title: editData?.title ?? "",
        description: editData?.description ?? "",
        due_at: editData?.due_at ? new Date(editData.due_at).toISOString().slice(0, 16) : "",
    })
    const router = useRouter()
    const [file, setfile] = useState<File | null>(null)
    const [fileKey, setFileKey] = useState(0)
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSubmit = async () => {
        if (!createform.title || !createform.description || !createform.due_at) {
            toast.error("Please fill in all required fields.")
            return
        }

        setLoading(true)
        let fileUrl = editData?.fileUrl ?? ""

        if (file) {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/fileupload", { method: "POST", body: formData })
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.message || "Upload failed. Try again.")
                setLoading(false)
                return
            }

            fileUrl = data.result.secure_url
        }

        const endpoint = isEditing ? `/api/assignments/${classroomId}/${editData!.id}`
            : "/api/assignments/create-assignment"

        const method = isEditing ? "PATCH" : "POST"

        const res = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...createform, fileUrl, classroomId }),
        })

        const data = await res.json()

        if (!res.ok) {
            toast.error(data.message || "Something went wrong. Try again.")
            setLoading(false)
            return
        }

        toast.success(isEditing ? "Assignment updated!" : "Assignment created!")
        setLoading(false)

        setTimeout(() => {
            setcreateAssignmentBox(false)
            router.refresh()
        }, 800)
    }

    const modalContent = (
        <div
            className='fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm'
            onClick={() => setcreateAssignmentBox(false)}
        >
            <div
                style={{ background: 'linear-gradient(180deg, #13141a 0%, #0c0d12 100%)' }}
                className='relative w-full max-w-xl rounded-2xl border border-zinc-800/90 p-8 shadow-2xl space-y-7 animate-in fade-in-50 zoom-in-95 duration-150 text-zinc-200'
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => setcreateAssignmentBox(false)}
                    className='absolute top-6 right-6 text-zinc-400 hover:text-rose-400 cursor-pointer transition-colors p-1'
                >
                    <X size={20} />
                </button>

                <div className='flex items-center gap-4 pl-0.5'>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900/80 border border-zinc-700/60 text-sky-400 shadow-sm'>
                        <Clipboard size={22} className='text-sky-400' />
                    </div>
                    <div>
                        <h3 className='font-bold text-2xl tracking-tight text-white'>
                            {isEditing ? "Update Assignment" : "Create Assignment"}
                        </h3>
                        <p className='text-xs text-zinc-400 mt-1 font-normal'>
                            {isEditing ? "Modify assignment details and attachments" : "Fill out required fields to publish a new assignment"}
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
                            placeholder='e.g. Assignment 1: Responsive Layouts'
                            required
                            value={createform.title}
                            onChange={(e) => setcreateform({ ...createform, title: e.target.value })}
                            className='w-full h-11 rounded-xl border-zinc-800 bg-zinc-900/60 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-sky-500 focus-visible:border-sky-500 text-sm transition-all'
                        />
                    </div>

                    <div className='w-full space-y-2'>
                        <Label htmlFor='description' className='text-zinc-300 text-xs font-semibold uppercase tracking-wider pl-0.5'>
                            Description <span className='text-rose-500'>*</span>
                        </Label>
                        <textarea
                            id='description'
                            placeholder='Provide assignment instructions or details...'
                            required
                            rows={4}
                            value={createform.description}
                            onChange={(e) => setcreateform({ ...createform, description: e.target.value })}
                            className='flex min-h-[110px] w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none resize-none focus-visible:ring-1 focus-visible:ring-sky-500 focus-visible:border-sky-500 transition-all'
                        />
                    </div>

                    <div className='w-full space-y-2'>
                        <Label htmlFor='due_at' className='text-zinc-300 text-xs font-semibold uppercase tracking-wider pl-0.5'>
                            Due Date <span className='text-rose-500'>*</span>
                        </Label>
                        <Input
                            id='due_at'
                            type='datetime-local'
                            required
                            value={createform.due_at}
                            min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                            onChange={(e) => setcreateform({ ...createform, due_at: e.target.value })}
                            className='w-full h-11 flex items-center rounded-xl border-zinc-800 bg-zinc-900/60 text-zinc-100 focus-visible:ring-1 focus-visible:ring-sky-500 focus-visible:border-sky-500 text-sm colored-scheme-dark transition-all'
                        />
                    </div>

                    <div className='w-full space-y-2 pt-1'>
                        <Label htmlFor='question-file' className='text-zinc-300 text-xs font-semibold uppercase tracking-wider pl-0.5'>
                            {isEditing ? "Replace Reference File" : "Upload Reference File"}
                        </Label>
                        <Input
                            key={fileKey}
                            id='question-file'
                            type='file'
                            className='w-full h-11 flex items-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 file:bg-zinc-800 file:text-zinc-200 file:border-0 file:border-r file:border-zinc-700 file:mr-4 file:px-5 file:h-full file:flex file:items-center file:justify-center file:text-xs file:font-semibold transition-colors p-0 cursor-pointer'
                            onChange={(e) => setfile(e.target.files?.[0] || null)}
                        />
                        <div className='flex items-center justify-between px-0.5 text-xs text-zinc-500 mt-1.5'>
                            <span>Max size: 10MB</span>
                            {isEditing && editData?.fileUrl && (
                                <a href={editData.fileUrl} target='_blank' rel='noopener noreferrer' className='text-sky-400 underline hover:text-sky-300 transition-colors font-medium'>
                                    View attached file
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                
                <div className='flex items-center justify-end gap-3 pt-5 border-t border-zinc-800/80 max-sm:flex-col-reverse'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() => setcreateAssignmentBox(false)}
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
                        {loading ? 'Please Wait...' : isEditing ? 'Save Changes' : 'Create Assignment'}
                    </Button>
                </div>
            </div>
        </div>
    )

    if (!mounted) return null

    return createPortal(modalContent, document.body)
}

export default CreateAssignment