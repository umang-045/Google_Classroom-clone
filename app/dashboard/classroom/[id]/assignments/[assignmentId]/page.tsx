"use client"
import React, { useState, useEffect } from 'react'
import CreateAssignment from '@/app/components/Assignment/CreateAssignment'
import { Button } from '@/components/ui/button'
import SummarizeButton from '@/app/components/SummariseButton'
import { TeacherWorkspace } from '@/app/components/Assignment/TeacherWorkspace'
import { StudentWorkspace } from '@/app/components/Assignment/StudentWorkspace'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

interface Assignment {
    id: number
    title: string
    description: string
    due_at: string
    fileUrl?: string
    submitted?: boolean
    marks?: number | null
    feedback?: string | null
    submissionFileUrl?: string | null
}

interface Submission {
    id: number | string
    studentName: string
    studentId: number
    studentEmail: string
    fileUrl: string | null
    submittedAt: string | null
    hasSubmitted: boolean
    marks: number | null,
    feedback: string | null
}

const AssignmentDetailPage = () => {
    const params = useParams()
    const router = useRouter()
    const classroomId = params.id as string
    const assignmentId = Number(params.assignmentId)

    const [role, setrole] = useState<string>("")
    const [assignment, setAssignment] = useState<Assignment | null>(null)
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [editAssignment, setEditAssignment] = useState<Assignment | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchAssignmentData = async (currentRole: string) => {
        try {
            const res = await fetch(`/api/assignments/${classroomId}`)
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.message || "Failed to load assignment")
            }
            const found = data.assignments.find((a: Assignment) => a.id === assignmentId)
            if (!found) { throw new Error("Assignment not found") }

            setAssignment(found)
            setIsSubmitted(!!found.submitted)

            if (currentRole === "teacher") {
                const subRes = await fetch(`/api/assignments/${classroomId}/${assignmentId}`)
                const subData = await subRes.json()
                if (!subRes.ok) throw new Error(subData.message || "Failed to load submissions")
                setSubmissions(subData.submissions || [])
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong loading assignment")
        }
    }

    useEffect(() => {
        const role = async () => {
            setLoading(true)
            setError("")
            try {
                const res = await fetch(`/api/classroom/${classroomId}`)
                const data = await res.json()
                if (!res.ok) {
                    router.push('/dashboard/allclasses')
                    return
                }
                setrole(data.role)
                await fetchAssignmentData(data.role)
            } finally {
                setLoading(false)
            }
        }

        role()
    }, [classroomId, assignmentId])

    const handleDelete = async () => {
        if (!assignment) return
        if (!confirm(`Delete "${assignment.title}"? This cannot be undone.`)) return

        setDeleteLoading(true)
        try {
            const res = await fetch(`/api/assignments/${classroomId}/${assignment.id}`, {
                method: "DELETE",
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Delete failed")
            toast.success("Assignment deleted")   
            router.push(`/dashboard/classroom/${classroomId}/assignments`)
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong"
            toast.error(message)
        } finally {
            setDeleteLoading(false)
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] gap-3">
            <div className="relative flex items-center justify-center">
                <div className="absolute size-12 bg-zinc-500/10 rounded-full animate-ping pointer-events-none" />
                <Loader2 className="size-8 animate-spin text-zinc-500 duration-1000" />
            </div>
            <span className="text-xs font-medium tracking-wider text-zinc-500 uppercase animate-pulse">
                Loading Details...
              </span>
        </div>
    )

    if (error) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className='p-6 text-center max-w-sm rounded-xl border border-rose-950 bg-rose-500/5 text-rose-400 text-sm'>
                {error}
            </div>
        </div>
    )
    
    if (!assignment) return null

    return (
        <div className='w-full py-6 px-4 md:px-6 text-zinc-200 animate-in fade-in duration-300'>
           
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 border-b border-zinc-800/60 pb-6'>
                <div className="space-y-1 w-full max-w-2xl">
                    <Button
                        variant='ghost'
                        onClick={() => router.push(`/dashboard/classroom/${classroomId}/assignments`)}
                        className='text-zinc-400 hover:text-white p-0 h-auto mb-3 cursor-pointer bg-transparent hover:bg-transparent text-xs gap-1.5 font-medium transition-colors group'
                    >
                        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                        Back to Assignments
                    </Button>
                    <h2 className='text-2xl font-bold tracking-tight text-white'>{assignment.title}</h2>
                    <p className='text-xs text-zinc-400 pt-0.5'>
                        Due Date: <span className="text-zinc-300 font-medium">{new Date(assignment.due_at).toLocaleString()}</span>
                    </p>

                    <div className="pt-2">
                        <SummarizeButton
                            type="assignment"
                            sourceId={assignment.id}
                            classroomId={Number(classroomId)}
                            className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 mt-1"
                        />
                    </div>
                </div>

                {role === "teacher" && (
                    <div className='flex items-center gap-3 max-sm:w-full shrink-0'>
                        <Button
                            type='button'
                            variant='outline'
                            className='rounded-md border-zinc-700 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs h-10 px-4 cursor-pointer transition-colors max-sm:flex-1'
                            onClick={() => setEditAssignment(assignment)}
                        >
                            Edit Details
                        </Button>
                        <Button
                            type='button'
                            variant='destructive'
                            className='rounded-md bg-rose-700 hover:bg-rose-800 text-white font-medium text-xs h-10 px-4 cursor-pointer transition-colors max-sm:flex-1'
                            onClick={handleDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? "Deleting..." : "Delete Assignment"}
                        </Button>
                    </div>
                )}
            </div>

        
            <div className="w-full bg-zinc-950/20 border border-zinc-900 rounded-xl p-1">
                {role === "teacher" && (
                    <TeacherWorkspace 
                        submissions={submissions} 
                        classroomId={Number(classroomId)} 
                        assignmentId={assignmentId} 
                        onGraded={() => fetchAssignmentData(role)} 
                    />
                )}

                {role === "student" && (
                    <StudentWorkspace
                        classroomId={Number(classroomId)}
                        assignmentId={assignment.id}
                        isSubmitted={isSubmitted}
                        setIsSubmitted={setIsSubmitted}
                        onSuccess={() => fetchAssignmentData(role)}
                        marks={assignment.marks ?? null}
                        feedback={assignment.feedback ?? null}
                        submissionFileUrl={assignment.submissionFileUrl ?? null}
                    />
                )}
            </div>

            {/* Custom Modal Sheet Fallback */}
            {editAssignment && (
                <CreateAssignment
                    classroomId={Number(classroomId)}
                    editData={editAssignment}
                    setcreateAssignmentBox={(val: boolean) => {
                        setEditAssignment(null)
                        if (!val) fetchAssignmentData(role)
                    }}
                />
            )}
        </div>
    )
}

export default AssignmentDetailPage