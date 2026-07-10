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
        <div className='w-full max-w-5xl mx-auto py-4 px-3 sm:px-6 pb-24 box-border'>
            <button
                onClick={() => router.push(`/dashboard/classroom/${classroomId}/quiz/${quizId}`)}
                className='flex items-center gap-1.5 text-xs sm:text-sm text-white/50 hover:text-white/80 transition-colors mb-4'
            >
                <ArrowLeft className='w-3.5 h-3.5' />
                Back to quiz
            </button>

            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6'>
                <div>
                    <h1 className='text-xl sm:text-2xl font-bold text-white tracking-tight'>Results</h1>
                    <div className='text-xs sm:text-sm text-white/50 mt-1 flex flex-wrap gap-x-1.5 gap-y-0.5 items-center'>
                        <span>{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</span>
                        {submissions.length > 0 && (
                            <>
                                <span className='text-white/30'>·</span>
                                <span>average score {average}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="size-8 animate-spin text-blue-400 duration-1000" />
                </div>
            ) : submissions.length > 0 ? (

                <div className="block w-full overflow-x-auto rounded-xl bg-white/5 border border-white/10">
                    <table className="w-full table-fixed text-left text-xs sm:text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-2 sm:px-4 py-3 text-[10px] sm:text-xs font-medium text-white/40 w-[50%]">
                                    Student
                                </th>
                                <th className="px-2 sm:px-4 py-3 text-[10px] sm:text-xs font-medium text-white/40 w-[30%]">
                                    Submitted
                                </th>
                                <th className="px-2 sm:px-4 py-3 text-[10px] sm:text-xs font-medium text-white/40 text-right w-[20%]">
                                    Score
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {submissions.map((s) => (
                                <tr
                                    key={s.id}
                                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                                >
                                    <td className="px-2 sm:px-4 py-3">
                                        <div className="flex items-center gap-2 max-w-full">
                                            {s.student.image ? (
                                                <img
                                                    src={s.student.image}
                                                    alt={s.student.name}
                                                    className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-7 h-7 rounded-full bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-[10px] text-sky-400 font-medium flex-shrink-0">
                                                    {getInitials(s.student.name)}
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium text-xs sm:text-sm truncate">
                                                    {s.student.name}
                                                </p>
                                                <p className="text-[10px] sm:text-xs text-white/40 truncate">
                                                    {s.student.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2 sm:px-4 py-3 text-[10px] sm:text-xs text-white/60">
                                        <span className="block truncate">
                                            {new Date(s.submitted_at).toLocaleDateString()}
                                        </span>
                                        <span className="hidden sm:block text-[10px] text-white/40">
                                            {new Date(s.submitted_at).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </td>

                                    <td className="px-2 sm:px-4 py-3 text-right font-semibold text-white whitespace-nowrap">
                                        {s.marks}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
                    <Users className='w-8 h-8 text-white/20 mb-3' />
                    <p className='text-xs sm:text-sm text-white/50 max-w-xs'>
                        {loadFailed ? "Couldn't load results. Try refreshing." : "No students have submitted this quiz yet."}
                    </p>
                </div>
            )}
        </div>
    )
}

export default QuizResultsPage