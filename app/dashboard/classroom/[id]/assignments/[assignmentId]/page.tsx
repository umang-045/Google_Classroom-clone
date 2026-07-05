"use client"
import React, { useState, useEffect } from 'react'
import CreateAssignment from '@/app/components/Assignment/CreateAssignment'
import { Button } from '@/components/ui/button'
import SummarizeButton from '@/app/components/SummariseButton'
import { TeacherWorkspace } from '@/app/components/Assignment/TeacherWorkspace'
import { StudentWorkspace } from '@/app/components/Assignment/StudentWorkspace'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
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
    if (loading) return <div className="flex items-center justify-center min-h-[75vh]">
        <Loader2 className="size-6 animate-spin text-gray-400" />
    </div>
    if (error) return <div className='p-8 text-center text-destructive'>{error}</div>
    if (!assignment) return null

    return (
        <div className='w-full py-4 px-2 text-white animate-fadeIn'>
            <div className='flex flex-col sm:flex-row m-4 justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-8'>
                <div>
                    <Button
                        variant='ghost'
                        onClick={() => router.push(`/dashboard/classroom/${classroomId}/assignments`)}
                        className='text-white/60 hover:text-white p-0 h-auto mb-2 cursor-pointer bg-transparent hover:bg-transparent'
                    >
                        &larr; Back
                    </Button>
                    <h2 className='text-2xl font-bold tracking-tight'>{assignment.title}</h2>
                    <p className='text-xs text-white/50 mt-0.5'>
                        Due: {new Date(assignment.due_at).toLocaleString()}
                    </p>

                    <SummarizeButton
                        type="assignment"
                        sourceId={assignment.id}
                        classroomId={Number(classroomId)}
                    />
                </div>

                {role === "teacher" && (
                    <div className='flex gap-3 max-sm:w-full'>
                        <Button
                            variant='outline'
                            className='border-white/20 text-white hover:bg-white/10 bg-transparent cursor-pointer text-xs h-9'
                            onClick={() => setEditAssignment(assignment)}
                        >
                            Edit Details
                        </Button>
                        <Button
                            variant='destructive'
                            className='text-xs h-9 cursor-pointer'
                            onClick={handleDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? "Deleting..." : "Delete Assignment"}
                        </Button>
                    </div>
                )}
            </div>

            {role === "teacher" && (
                <TeacherWorkspace submissions={submissions} classroomId={Number(classroomId)} assignmentId={assignmentId} onGraded={() => fetchAssignmentData(role)} />
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