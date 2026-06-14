import React, { useState, useEffect } from 'react'
import CreateAssignment from './CreateAssignment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const Assignments = ({ classroomId, role}: {classroomId: number,role: string}) => {
    const [assignments, setAssignments] = useState<any[]>([])
    const [fetchError, setFetchError] = useState("")
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [fileKey, setFileKey] = useState(0)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [createAssignmentBox, setCreateAssignmentBox] = useState(false)
    const [loading, setLoading] = useState(false)

    const fetchAssignments = async () => {
        const res = await fetch(`/api/assignments/${classroomId}`)
        const data = await res.json()

        if (!res.ok) {
            setFetchError(data.message || "Failed to load assignments")
            return
        }

        setAssignments(data.assignments)
    }

    useEffect(() => {
        fetchAssignments()
    }, [classroomId])

    const handleSubmit = async (assignmentId: number) => {
        setError("")
        setSuccess("")

        if (!file) {
            setError("Please select a file")
            return
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("assignmentId", assignmentId.toString())

        try {
            setLoading(true)

            const res = await fetch("/api/submissions", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Submission failed")
                return
            }

            setSuccess("Assignment submitted successfully")
            setFile(null)
            setFileKey(prev => prev + 1)

            setTimeout(() => {
                setSelectedAssignmentId(null)
                setSuccess("")
            }, 1500)
        } catch (err) {
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='py-6 px-4 sm:px-6 lg:px-8'>

            {role === "teacher" && (
                <div className='flex justify-end mb-6'>
                    <Button onClick={() => setCreateAssignmentBox(true)}>
                        + Create Assignment
                    </Button>

                    {createAssignmentBox && (
                        <CreateAssignment
                            classroomId={classroomId}
                            setcreateAssignmentBox={(val: boolean) => {
                                setCreateAssignmentBox(val)

                                if (!val) fetchAssignments()
                            }}
                        />
                    )}
                </div>
            )}

            {fetchError && (
                <p className='text-center text-destructive mb-4'>
                    {fetchError}
                </p>
            )}

            {assignments && assignments.length > 0 ? (
                <div className='space-y-3'>
                    {assignments.map((assignment) => (
                        /* Custom Card Container */
                        <div
                            key={assignment.id}
                            className='w-full rounded-xl bg-white/10 border border-white/15 text-white p-6 shadow-sm'
                        >
                         
                            <div className='pb-2'>
                                <div className='flex items-start justify-between gap-4'>
                                    <div>
                                      
                                        <h3 className='text-base font-semibold leading-none tracking-tight text-white'>
                                            {assignment.title}
                                        </h3>

                                        
                                        <p className='mt-1 text-sm text-white/60'>
                                            {assignment.description}
                                        </p>
                                    </div>

                                    <span className='text-xs text-white/50 whitespace-nowrap mt-1'>
                                        Due: {new Date(assignment.due_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                          
                            {assignment.fileUrl && (
                                <div className='pt-0 pb-2'>
                                    <a
                                        href={assignment.fileUrl}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-sm underline hover:text-blue-300'
                                    >
                                        View Attached File
                                    </a>
                                </div>
                            )}

                  
                            {role === "student" && (
                                <div className='space-y-3 pt-2'>
                                    {selectedAssignmentId === assignment.id ? (
                                        <div className='space-y-3'>
                                            <div className='space-y-1'>
                                                <Label
                                                    htmlFor={`file-${assignment.id}`}
                                                    className='text-white/80'
                                                >
                                                    Upload your submission
                                                </Label>

                                                <Input
                                                    key={fileKey}
                                                    id={`file-${assignment.id}`}
                                                    type='file'
                                                    className='text-white/70 bg-white/5 border-white/20 file:border-white/20 file:text-white/80 p-0 pr-3 italic file:mr-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-white/10 file:px-3 file:text-sm file:font-medium file:not-italic'
                                                    onChange={(e) =>
                                                        setFile(e.target.files?.[0] || null)
                                                    }
                                                />

                                                <p className='text-xs text-white/40'>
                                                    Max 10MB
                                                </p>
                                            </div>

                                            {error && (
                                                <p className='text-destructive text-sm'>
                                                    {error}
                                                </p>
                                            )}

                                            {success && (
                                                <p className='text-green-400 text-sm'>
                                                    {success}
                                                </p>
                                            )}

                                            <div className='flex gap-2'>
                                                <Button
                                                    variant='outline'
                                                    className='flex-1 border-white/20 text-white/80 hover:bg-white/10 bg-transparent'
                                                    onClick={() => {
                                                        setSelectedAssignmentId(null)
                                                        setError("")
                                                        setSuccess("")
                                                        setFile(null)
                                                        setFileKey(prev => prev + 1)
                                                    }}
                                                >
                                                    Cancel
                                                </Button>

                                                <Button
                                                    className='flex-1'
                                                    disabled={loading}
                                                    onClick={() =>
                                                        handleSubmit(assignment.id)
                                                    }
                                                >
                                                    {loading ? "Submitting..." : "Submit"}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            variant='outline'
                                            className='border-white/20 text-white/80 hover:bg-white/10 bg-transparent'
                                            onClick={() => {
                                                setSelectedAssignmentId(assignment.id)
                                                setError("")
                                                setSuccess("")
                                            }}
                                        >
                                            Submit Assignment
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                !fetchError && (
                    <p className='text-center text-white/50'>
                        No assignments yet.
                    </p>
                )
            )}
        </div>
    )
}

export default Assignments