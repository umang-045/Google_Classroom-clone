"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import CreateAssignment from '@/app/components/CreateAssignment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Assignment {
    id: number
    title: string
    description: string
    due_at: string
    fileUrl?: string
    submitted?: boolean
}

interface Submission {
    id: number
    studentName: string
    studentEmail: string
    fileUrl: string
    submittedAt: string
}

const Assignments = ({ classroomId, role }: { classroomId: number, role: string }) => {
    const router = useRouter()
    const searchParams = useSearchParams()

  
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [fetchError, setFetchError] = useState("")
    const [submittedIds, setSubmittedIds] = useState<Set<number>>(new Set())
    const [createAssignmentBox, setCreateAssignmentBox] = useState(false)

    
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null)
    const [assignment, setAssignment] = useState<Assignment | null>(null)
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [detailLoading, setDetailLoading] = useState(false)
    const [detailError, setDetailError] = useState("")

    
    const [file, setFile] = useState<File | null>(null)
    const [fileKey, setFileKey] = useState(0)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [submitError, setSubmitError] = useState("")
    const [submitSuccess, setSubmitSuccess] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)

    const [editAssignment, setEditAssignment] = useState<Assignment | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const fetchAssignments = async () => {
        const res = await fetch(`/api/assignments/${classroomId}`)
        const data = await res.json()
        if (!res.ok) { 
            setFetchError(data.message || "Failed to load assignments")
            return 
        }
        setAssignments(data.assignments)

        const submitted = new Set<number>(
            data.assignments.filter((a: Assignment) => a.submitted).map((a: Assignment) => a.id)
        )
        setSubmittedIds(submitted)
    }

    const fetchSingleAssignmentDetails = async (assignmentId: number) => {
        try {
            setDetailLoading(true)
            setDetailError("")
            

            const currentAssignment = assignments.find((a) => a.id === assignmentId)
            if (!currentAssignment) throw new Error("Assignment details not resolved")
            
            setAssignment(currentAssignment)
            setIsSubmitted(submittedIds.has(assignmentId) || !!currentAssignment.submitted)

            if (role === "teacher") {
                const subRes = await fetch(`/api/assignments/${classroomId}/${assignmentId}`)
                const subData = await subRes.json()
                if (!subRes.ok) throw new Error(subData.message || "Failed to load submissions")
                setSubmissions(subData.submissions || [])
            }
        } catch (err: any) {
            setDetailError(err.message || "Something went wrong loading assignment")
        } finally {
            setDetailLoading(false)
        }
    }

    useEffect(() => { 
        fetchAssignments() 
    }, [classroomId])

    useEffect(() => {
        if (selectedAssignmentId !== null) {
            fetchSingleAssignmentDetails(selectedAssignmentId)
        }
    }, [selectedAssignmentId])

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

            setSelectedAssignmentId(null)
            setAssignment(null)
            fetchAssignments()
        } catch (err: any) {
            alert(err.message || "Something went wrong")
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleStudentSubmit = async () => {
        setSubmitError("")
        setSubmitSuccess("")
        if (!file) { setSubmitError("Please select a file"); return }
        if (!assignment) return

        try {
            setSubmitLoading(true)
            const formData = new FormData()
            formData.append("file", file)

            const uploadRes = await fetch("/api/fileupload", { method: "POST", body: formData })
            const uploadData = await uploadRes.json()
            if (!uploadRes.ok) throw new Error(uploadData.message || "Upload failed")

            const fileUrl: string = uploadData.result.secure_url

            const res = await fetch(`/api/assignments/${classroomId}/submission`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileUrl, assignmentId: assignment.id }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Submission failed")

            setIsSubmitted(true)
            setSubmitSuccess("Assignment submitted successfully!")
            fetchAssignments()
        } catch (err: any) {
            setSubmitError(err.message || "Something went wrong")
        } finally {
            setSubmitLoading(false)
        }
    }

  
if (selectedAssignmentId !== null) {
    if (detailLoading) return <div className='p-8 text-center text-white/50'>Loading details view...</div>
    if (detailError) return <div className='p-8 text-center text-destructive'>{detailError}</div>
    if (!assignment) return null

    return (
        <div className='w-full py-4 px-2 text-white animate-fadeIn'>
            
          
            <div className='flex flex-col sm:flex-row m-4  justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-8'>
                <div>
                    <Button 
                        variant='ghost' 
                        onClick={() => { setSelectedAssignmentId(null); setAssignment(null); }}
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
                            className='border-white/20 text-white hover:bg-white/10 bg-transparent cursor-pointer  text-xs h-9'
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
                <div className='w-full overflow-x-auto'>
                    <div className='min-w-[800px]'>
                  
                        <div className='grid grid-cols-12  p-8 text-xs font-semibold text-white/40 uppercase tracking-wider  border-b border-white/5 '>
                            <div className='col-span-4'>Student Details</div>
                            <div className='col-span-3'>Submission Date</div>
                            <div className='col-span-2 text-center'>Marks / 100</div>
                            <div className='col-span-1.5 text-center'>Checked</div>
                            <div className='col-span-1.5 text-right'>Action</div>
                        </div>

                   
                        {submissions.length === 0 ? (
                            <p className='text-xs text-white/40 py-8 text-center'>No student submissions submitted yet.</p>
                        ) : (
                            <div className='m-4'>
                                {submissions.map((sub) => (
                                    <div key={sub.id} className='grid grid-cols-12 gap-4 items-center py-4 text-sm hover:bg-white/[0.02] transition-colors rounded-lg px-2 group'>
                                       
                                        <div className='col-span-4 min-w-0'>
                                            <p className='font-medium text-white truncate'>{sub.studentName}</p>
                                            <p className='text-xs text-white/40 truncate mt-0.5'>{sub.studentEmail}</p>
                                        </div>

                                        
                                        <div className='col-span-3 text-xs text-white/70'>
                                            {new Date(sub.submittedAt).toLocaleString(undefined, {
                                                dateStyle: 'short',
                                                timeStyle: 'short'
                                            })}
                                        </div>

                                       
                                        <div className='col-span-2 text-center'>
                                            <span className='inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-md font-mono text-xs text-white/90'>
                                                -- / 100
                                            </span>
                                        </div>

                                       
                                        <div className='col-span-1.5 flex justify-center'>
                                            <span className='inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'>
                                                <span className='w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse' />
                                                Pending
                                            </span>
                                        </div>

                                       
                                        <div className='col-span-1.5 text-right'>
                                            <a 
                                                href={sub.fileUrl} 
                                                target='_blank' 
                                                rel='noopener noreferrer' 
                                                className='inline-flex items-center text-xs text-blue-400 hover:text-blue-300 underline'
                                            >
                                                View File
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}


            {role === "student" && (
                <div className='w-full flex justify-center py-6 px-4 md:px-12 lg:px-24'>
                    <div className='w-full max-w-xl'>
                        <Card className='bg-white/5 border-white/10 text-white shadow-xl'>
                            <CardHeader className='py-4'>
                                <CardTitle className='text-md text-white'>Your Work</CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4 pb-5'>
                                {isSubmitted ? (
                                    <div className='rounded-md bg-green-500/10 border border-green-500/20 p-4 text-center'>
                                        <p className='text-green-400 font-medium text-xs flex items-center justify-center gap-1.5'>
                                            ✓ Turned In Successfully
                                        </p>
                                        <p className='text-[11px] text-white/50 mt-1'>Your file configuration dashboard has updated.</p>
                                    </div>
                                ) : (
                                    <div className='space-y-4'>
                                        <div className='space-y-1.5'>
                                            <Label htmlFor='submit-file' className='text-xs text-white/80'>File attachment *</Label>
                                            <Input 
                                                key={fileKey} 
                                                id='submit-file' 
                                                type='file' 
                                                className='bg-transparent text-white border-white/20 text-xs p-1 h-auto file:bg-white/10 file:text-white file:border-0 file:py-1 file:px-2 file:rounded-sm file:mr-2 file:text-xs cursor-pointer' 
                                                onChange={(e) => setFile(e.target.files?.[0] || null)} 
                                            />
                                        </div>
                                        {submitError && <p className='text-destructive text-[11px] font-medium'>{submitError}</p>}
                                        {submitSuccess && <p className='text-green-400 text-[11px] font-medium'>{submitSuccess}</p>}
                                        <Button onClick={handleStudentSubmit} disabled={submitLoading} className='w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 font-medium transition-colors'>
                                            {submitLoading ? "Submitting File Data..." : "Turn In"}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {editAssignment && (
                <CreateAssignment
                    classroomId={classroomId}
                    editData={editAssignment}
                    setcreateAssignmentBox={(val: boolean) => {
                        setEditAssignment(null)
                        if (!val) fetchSingleAssignmentDetails(selectedAssignmentId)
                    }}
                />
            )}
        </div>
    )
}

    
    return (
        <div className='py-6 px-4 sm:px-6 lg:px-8'>
            {role === "teacher" && (
                <div className='flex justify-end mb-6'>
                    <Button onClick={() => setCreateAssignmentBox(true)}>+ Create Assignment</Button>
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

            {fetchError && <p className='text-center text-destructive mb-4'>{fetchError}</p>}

            {assignments.length > 0 ? (
                <div className='space-y-3'>
                    {assignments.map((assignment) => (
                        <div
                            key={assignment.id}
                            onClick={() => setSelectedAssignmentId(assignment.id)}
                            className="w-full rounded-xl bg-white/10 border border-white/15 text-white p-6 shadow-sm cursor-pointer hover:bg-white/15 transition-all duration-200 group layout-card"
                        >
                            <div className='flex items-start justify-between gap-4'>
                                <div className='min-w-0 flex-1'>
                                    <h3 className='text-base font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1'>
                                        {assignment.title}
                                    </h3>
                                    <p className='mt-1 text-sm text-white/60 line-clamp-2'>
                                        {assignment.description}
                                    </p>
                                </div>
                                <span className='text-xs text-white/50 whitespace-nowrap mt-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/5'>
                                    Due: {new Date(assignment.due_at).toLocaleDateString()}
                                </span>
                            </div>

                            <div className='mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-4' onClick={e => e.stopPropagation()}>
                                <div>
                                    {assignment.fileUrl && (
                                        <a href={assignment.fileUrl} target='_blank' rel='noopener noreferrer' className='text-xs text-blue-400 underline hover:text-blue-300 inline-flex items-center gap-1'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className='w-3 h-3' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                            View Resource
                                        </a>
                                    )}
                                </div>

                                <div>
                                    {role === "student" ? (
                                        submittedIds.has(assignment.id) ? (
                                            <div className='flex items-center gap-1.5 text-green-400 text-xs font-medium bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full'>
                                                Turned In
                                            </div>
                                        ) : (
                                            <Button variant='outline' size='sm' className='border-white/20 text-white/80 hover:bg-white/10 bg-transparent text-xs h-8' onClick={() => setSelectedAssignmentId(assignment.id)}>
                                                Open Workspace
                                            </Button>
                                        )
                                    ) : (
                                        <span className='text-xs text-white/40 hover:text-white/60 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform' onClick={() => setSelectedAssignmentId(assignment.id)}>
                                            Manage submissions &rarr;
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                !fetchError && <p className='text-center text-white/50 py-12'>No assignments published here yet.</p>
            )}
        </div>
    )
}

export default Assignments