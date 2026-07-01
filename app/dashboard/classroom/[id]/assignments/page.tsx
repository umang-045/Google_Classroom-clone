"use client"
import React, { useState, useEffect } from 'react'
import CreateAssignment from '@/app/components/Assignment/CreateAssignment'
import { Button } from '@/components/ui/button'
import { AssignmentCard } from '@/app/components/Assignment/AssignmentCard'
import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Assignment {
    id: number
    title: string
    description: string
    created_at: string
    due_at: string
    fileUrl?: string
    submitted?: boolean
}

const AssignmentsPage = () => {
    const params = useParams()
    const router = useRouter()
    const classroomId = params.id

    const [role, setRole] = useState<string>("")
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [loadFailed, setLoadFailed] = useState(false)
    const [submittedIds, setSubmittedIds] = useState<Set<number>>(new Set())
    const [createAssignmentBox, setCreateAssignmentBox] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRole = async () => {
            const res = await fetch(`/api/classroom/${classroomId}`)
            if (res.ok) {
                const data = await res.json()
                setRole(data.role)
            }
        }
        fetchRole()
    }, [classroomId])

    const fetchAssignments = async () => {
        try {
            const res = await fetch(`/api/assignments/${classroomId}`)
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.message || "Failed to load assignments")
                setLoadFailed(true)
                return
            }
            setAssignments(data.assignments)
            setLoadFailed(false)
            const submitted = new Set<number>(
                data.assignments.filter((a: Assignment) => a.submitted).map((a: Assignment) => a.id)
            )
            setSubmittedIds(submitted)
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong"
            toast.error(message)
            setLoadFailed(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (classroomId) fetchAssignments()
    }, [classroomId])

    const handleOpenWorkspace = (assignmentId: number) => {
        router.push(`/dashboard/classroom/${classroomId}/assignments/${assignmentId}`)
    }

    return (
        <div className='py-4 px-2 sm:px-4'>
            {role === "teacher" && (
                <div className='flex justify-end mb-6'>
                    <Button onClick={() => setCreateAssignmentBox(true)}>+ Create Assignment</Button>
                    {createAssignmentBox && (
                        <CreateAssignment
                            classroomId={Number(classroomId)}
                            setcreateAssignmentBox={(val: boolean) => {
                                setCreateAssignmentBox(val)
                                if (!val) fetchAssignments()
                            }}
                        />
                    )}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center min-h-[75vh]">
                    <Loader2 className="size-6 animate-spin text-gray-400" />
                </div>
            ) : assignments.length > 0 ? (
                <div className='space-y-3'>
                    {assignments.map((item) => (
                        <AssignmentCard
                            key={item.id}
                            assignment={item}
                            role={role}
                            isSubmittedByStudent={submittedIds.has(item.id)}
                            onOpenWorkspace={handleOpenWorkspace}
                        />
                    ))}
                </div>
            ) : (
                <p className='text-center text-white/50 py-12'>
                    {loadFailed ? "Couldn't load assignments. Try refreshing." : "No assignments published here yet."}
                </p>
            )}
        </div>
    )
}

export default AssignmentsPage