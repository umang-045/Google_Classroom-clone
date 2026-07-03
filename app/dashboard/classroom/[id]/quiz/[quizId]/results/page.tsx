"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2, ArrowLeft, Users } from 'lucide-react'


interface Student {
    id: number
    name: string
    email: string
    image: string | null
}

interface Submission {
    id: number
    marks: number
    status: string
    submitted_at: string
    student: Student
}

const QuizResultsPage = () => {
    const params = useParams()
    const router = useRouter()
    const classroomId = params.id
    const quizId = params.quizId

    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [loading, setLoading] = useState(true)
    const [loadFailed, setLoadFailed] = useState(false)

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await fetch(`/api/quiz/${classroomId}/${quizId}/submission`, {
                    method: "GET"
                })
                const data = await res.json()
                if (!res.ok) {
                    toast.error(data.message || "Failed to load submissions")
                    setLoadFailed(true)
                    return
                }
                setSubmissions(data.submissions)
            } catch (err) { 
                toast.error("Something went wrong")
                setLoadFailed(true)
            } finally {
                setLoading(false)
            }
        }
        if (classroomId && quizId) fetchSubmissions()
    }, [classroomId, quizId])

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const average = submissions.length > 0
        ? (submissions.reduce((sum, s) => sum + s.marks, 0) / submissions.length).toFixed(1)
        : "0"

    return (
        <div className='py-4 px-2 sm:px-4 w-[90%] pb-24'>
            <button
                onClick={() => router.push(`/dashboard/classroom/${classroomId}/quiz/${quizId}`)}
                className='flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors mb-4'
            >
                <ArrowLeft className='w-4 h-4' />
                Back to quiz
            </button>

            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='text-2xl font-bold text-white'>Results</h1>
                    <p className='text-sm text-white/50 mt-1'>
                        {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
                        {submissions.length > 0 && ` · average score ${average}`}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="size-6 animate-spin text-gray-400" />
                </div>
            ) : submissions.length > 0 ? (
                <div className='rounded-xl bg-white/5 border border-white/10 overflow-hidden'>
                    <table className='w-full text-sm'>
                        <thead>
                            <tr className='border-b border-white/10 text-left'>
                                <th className='px-5 py-3 text-xs font-medium text-white/40'>Student</th>
                                <th className='px-5 py-3 text-xs font-medium text-white/40'>Submitted</th>
                                <th className='px-5 py-3 text-xs font-medium text-white/40 text-right'>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((s) => (
                                <tr key={s.id} className='border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors'>
                                    <td className='px-5 py-3'>
                                        <div className='flex items-center gap-3'>
                                            {s.student.image ? (
                                                <img
                                                    src={s.student.image}
                                                    alt={s.student.name}
                                                    className='w-8 h-8 rounded-full object-cover'
                                                />
                                            ) : (
                                                <div className='w-8 h-8 rounded-full bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-xs text-sky-400 font-medium'>
                                                    {getInitials(s.student.name)}
                                                </div>
                                            )}
                                            <div>
                                                <p className='text-white'>{s.student.name}</p>
                                                <p className='text-xs text-white/40'>{s.student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-5 py-3 text-white/60 text-xs'>
                                        {new Date(s.submitted_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                    </td>
                                    <td className='px-5 py-3 text-right'>
                                        <span className='font-semibold text-white'>{s.marks}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center py-16 text-center'>
                    <Users className='w-8 h-8 text-white/20 mb-3' />
                    <p className='text-white/50'>
                        {loadFailed ? "Couldn't load results. Try refreshing." : "No students have submitted this quiz yet."}
                    </p>
                </div>
            )}
        </div>
    )
}

export default QuizResultsPage