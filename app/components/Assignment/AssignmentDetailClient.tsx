"use client"

import React, { useState } from 'react'
import CreateAssignment from '@/app/components/Assignment/CreateAssignment'
import { Button } from '@/components/ui/button'
import { TeacherWorkspace } from '@/app/components/Assignment/TeacherWorkspace'
import { StudentWorkspace } from '@/app/components/Assignment/StudentWorkspace'
import { useParams, useRouter } from 'next/navigation'

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
    canReupload?: boolean
    reuploadDeadline?: string | null
}

interface Submission {
    id: number
    studentName: string
    studentId: number
    studentEmail?: string
    fileUrl: string | null
    submittedAt?: string | null
    hasSubmitted?: boolean
    marks: number | null
    feedback: string | null
    createdAt: string
}

interface ExtensionRequestItem {
    id: number
    studentName: string
    studentEmail: string
    studentImage?: string | null
    reason?: string
    createdAt: string
}

interface AssignmentDetailClientProps {
    classroomId: string
    initialRole: string
    initialAssignment: Assignment
    initialSubmissions: Submission[]
    initialRequests?: ExtensionRequestItem[]
}

const AssignmentDetailClient = ({ 
    classroomId, 
    initialRole, 
    initialAssignment, 
    initialSubmissions,
    initialRequests = []
}: AssignmentDetailClientProps) => {
    const params = useParams()
    const router = useRouter()
    const assignmentId = Number(params.assignmentId)

    const [role] = useState<string>(initialRole)
    const [assignment, setAssignment] = useState<Assignment | null>(initialAssignment)
    const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions)
    const [requests, setRequests] = useState<ExtensionRequestItem[]>(initialRequests)
    const [isSubmitted, setIsSubmitted] = useState(!!initialAssignment.submitted)
    const [editAssignment, setEditAssignment] = useState<Assignment | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

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
                setRequests(subData.requests || [])
            }
        } catch (err: any) {
            console.log(err.message || "Something went wrong loading assignment")
        }
    }

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
            router.push(`/classroom/${classroomId}/assignments`)
        } catch (err: any) {
            alert(err.message || "Something went wrong")
        } finally {
            setDeleteLoading(false)
        }
    }

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
                <TeacherWorkspace 
                    submissions={submissions} 
                    requests={requests}
                    classroomId={Number(classroomId)} 
                    assignmentId={assignmentId} 
                    onSuccess={() => fetchAssignmentData(role)} 
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
                    due_at={assignment.due_at}
                    canReupload={!!assignment.canReupload}
                    reuploadDeadline={assignment.reuploadDeadline ?? null}
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

export default AssignmentDetailClient