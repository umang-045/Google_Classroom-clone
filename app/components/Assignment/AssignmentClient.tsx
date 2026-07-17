"use client"
import React, { useState } from 'react'
import CreateAssignment from '@/app/components/Assignment/CreateAssignment'
import { Button } from '@/components/ui/button'
import { AssignmentCard } from '@/app/components/Assignment/AssignmentCard'
import { useRouter } from 'next/navigation'
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

interface AssignmentsClientProps {
    classroomId: string
    initialRole: string
    initialAssignments: Assignment[]
}

const AssignmentsClient = ({ classroomId, initialRole, initialAssignments }: AssignmentsClientProps) => {
    const router = useRouter()

    const [role] = useState<string>(initialRole)
    const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
    const [loadFailed, setLoadFailed] = useState(false)
    const [submittedIds, setSubmittedIds] = useState<Set<number>>(
        new Set(initialAssignments.filter((a) => a.submitted).map((a) => a.id))
    )
    const [createAssignmentBox, setCreateAssignmentBox] = useState(false)

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
        }
    }

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

            {assignments.length > 0 ? (
                <div className='space-y-3'>
                    {assignments.map((item) => (
                        <AssignmentCard
                            classroomId={Number(classroomId)}
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

export default AssignmentsClient