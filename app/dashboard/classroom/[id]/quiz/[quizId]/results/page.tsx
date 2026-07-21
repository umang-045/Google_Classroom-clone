"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2, ArrowLeft, Users, Trophy, Award, Calendar } from 'lucide-react'

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

    const topScore = submissions.length > 0
        ? Math.max(...submissions.map(s => s.marks))
        : 0

    return (
        <div className='w-full min-h-screen py-6 px-3 sm:px-6 lg:px-10 xl:px-14 pb-24 text-zinc-100 selection:bg-sky-500/30 selection:text-sky-200'>
            <button
                onClick={() => router.push(`/dashboard/classroom/${classroomId}/quiz/${quizId}`)}
                className='inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-all mb-6 group cursor-pointer'
            >
                <ArrowLeft className='w-3.5 h-3.5 transition-transform group-hover:-translate-x-1' />
                Back to quiz
            </button>

            <div className='flex items-start justify-between gap-4 flex-col sm:flex-row mb-6 w-full'>
                <div>
                    <h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-white'>Quiz Submissions</h1>
                    <p className='text-xs sm:text-sm text-zinc-400 mt-1'>Review individual student performance and scores</p>
                </div>
            </div>

            {/* Top Summary Stats Bar */}
            {!loading && submissions.length > 0 && (
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 w-full'>
                    <div className='rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md p-4 flex items-center gap-3.5 shadow-xl'>
                        <div className='p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0'>
                            <Users className='w-5 h-5' />
                        </div>
                        <div>
                            <p className='text-xs text-zinc-400 font-medium'>Total Submissions</p>
                            <p className='text-lg font-bold text-white'>{submissions.length}</p>
                        </div>
                    </div>

                    <div className='rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md p-4 flex items-center gap-3.5 shadow-xl'>
                        <div className='p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0'>
                            <Award className='w-5 h-5' />
                        </div>
                        <div>
                            <p className='text-xs text-zinc-400 font-medium'>Average Score</p>
                            <p className='text-lg font-bold text-emerald-400'>{average}</p>
                        </div>
                    </div>

                    <div className='rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md p-4 flex items-center gap-3.5 shadow-xl'>
                        <div className='p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0'>
                            <Trophy className='w-5 h-5' />
                        </div>
                        <div>
                            <p className='text-xs text-zinc-400 font-medium'>Highest Score</p>
                            <p className='text-lg font-bold text-amber-400'>{topScore}</p>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center min-h-[40vh] w-full">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
                </div>
            ) : submissions.length > 0 ? (
                <div className="w-full rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md shadow-xl overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-xs sm:text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800/80 bg-zinc-900/80 text-zinc-400 font-medium">
                                    <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider">
                                        Submitted Date
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-right">
                                        Score
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-800/60">
                                {submissions.map((s) => (
                                    <tr
                                        key={s.id}
                                        className="hover:bg-zinc-800/40 transition-colors"
                                    >
                                        <td className="px-4 sm:px-6 py-4">
                                            <div className="flex items-center gap-3 max-w-full">
                                                {s.student.image ? (
                                                    <img
                                                        src={s.student.image}
                                                        alt={s.student.name}
                                                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-zinc-700/60"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-semibold shrink-0">
                                                        {getInitials(s.student.name)}
                                                    </div>
                                                )}

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-medium text-xs sm:text-sm truncate">
                                                        {s.student.name}
                                                    </p>
                                                    <p className="text-[11px] sm:text-xs text-zinc-400 truncate">
                                                        {s.student.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 sm:px-6 py-4 text-xs text-zinc-400">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                                                <span>{new Date(s.submitted_at).toLocaleDateString()}</span>
                                                <span className="text-zinc-600 hidden sm:inline">•</span>
                                                <span className="text-zinc-500 hidden sm:inline">
                                                    {new Date(s.submitted_at).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-4 sm:px-6 py-4 text-right">
                                            <span className="inline-flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                                                {s.marks} pts
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className='w-full rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md p-12 text-center shadow-xl flex flex-col items-center justify-center'>
                    <div className='p-3 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 text-zinc-500 mb-3'>
                        <Users className='w-8 h-8' />
                    </div>
                    <h3 className='text-base font-semibold text-white mb-1'>No submissions found</h3>
                    <p className='text-xs text-zinc-400 max-w-sm'>
                        {loadFailed ? "Couldn't load results due to a network error. Try refreshing." : "No students have completed and submitted this quiz yet."}
                    </p>
                </div>
            )}
        </div>
    )
}

export default QuizResultsPage