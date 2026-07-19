"use client"
import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PolarAngleAxis, RadialBarChart, RadialBar } from 'recharts'
import { ArrowLeft, Search, TrendingUp, BarChart3, Eye, ChevronLeft, ChevronRight, X, Loader2, UserRound, Users, ClipboardList, FileQuestion, Video, Megaphone, UploadCloud, ClipboardCheck, GraduationCap, AlertTriangle, Mail } from 'lucide-react'

interface StudentSummary {
    id: number
    name: string
    email: string
    image: string | null
    assignmentsSubmitted: number
    totalAssignments: number
    avgAssignmentScore: number | null
    quizzesAttempted: number
    totalQuizzes: number
    avgQuizScore: number | null
}

interface MissingSubmission {
    id: number
    title: string
    due_at: string
    missingStudents: {
        id: number
        name: string
        email: string
        image: string | null
    }[]
}

interface Overview {
    totalStudents: number
    totalAssignments: number
    totalQuizzes: number
    totalMeetings: number
    totalAnnouncements: number
    avgAssignmentScore: number
    avgQuizScore: number
    overallSubmissionRate: number
    pendingGradingCount: number
    upcomingMeetings: number
    completedMeetings: number
    totalSubmissionsCount: number
    gradedSubmissionsCount: number
    totalQuizAttempts: number
    gradedQuizAttempts: number
}

interface ClassroomInfo {
    id: number
    className: string
    section: string
    semester: string
}

interface AssignmentBreakdown {
    id: number
    title: string
    due_at: string
    submissionCount: number
    avgScore: number
}

interface QuizBreakdown {
    id: number
    title: string
    created_at: string
    attemptCount: number
    avgScore: number
}

interface AssignmentDetail {
    id: number
    title: string
    due_at: string
    submitted: boolean
    marks: number | null
    feedback: string | null
}

interface QuizDetail {
    id: number
    title: string
    attempted: boolean
    marks: number | null
    status: string | null
}

interface StudentDetail {
    student: { id: number; name: string; email: string; image: string | null }
    assignments: AssignmentDetail[]
    quizzes: QuizDetail[]
}

interface AnalyticsClientProps {
    classroomId: string
    teacherName: string
    initialClassroom: ClassroomInfo
    initialOverview: Overview
    initialAssignmentBreakdown: AssignmentBreakdown[]
    initialQuizBreakdown: QuizBreakdown[]
    initialStudents: StudentSummary[]
    initialMissingSubmissions: MissingSubmission[]
}

const PAGE_SIZE = 6

const AvatarImage = ({ src, alt, sizeClass = "size-8" }: { src: string | null, alt: string, sizeClass?: string }) => {
    const [hasError, setHasError] = useState(false)

    if (!src || hasError) {
        return (
            <div className={`${sizeClass} rounded-full bg-zinc-850 border border-zinc-700/40 flex items-center justify-center text-zinc-500`}>
                <UserRound className="w-1/2 h-1/2" />
            </div>
        )
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            onError={() => setHasError(true)}
            className={`${sizeClass} rounded-full object-cover border border-zinc-700/30`} 
        />
    )
}

const AnalyticsClient = ({ classroomId, teacherName, initialClassroom, initialOverview, initialAssignmentBreakdown, initialQuizBreakdown, initialStudents, initialMissingSubmissions }: AnalyticsClientProps) => {
    const router = useRouter()
    const [classroom] = useState<ClassroomInfo>(initialClassroom)
    const [overview] = useState<Overview>(initialOverview)
    const [assignmentBreakdown] = useState<AssignmentBreakdown[]>(initialAssignmentBreakdown)
    const [quizBreakdown] = useState<QuizBreakdown[]>(initialQuizBreakdown)
    const [students] = useState<StudentSummary[]>(initialStudents)
    const [missingSubmissions] = useState<MissingSubmission[]>(initialMissingSubmissions)
    const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null)
    const [detailLoading, setDetailLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)

    const trendData = useMemo(() => assignmentBreakdown.map((a, i) => ({
        name: `A${i + 1}`,
        title: a.title,
        avgScore: Number(a.avgScore.toFixed(1)),
    })), [assignmentBreakdown])

    const quizChartData = useMemo(() => quizBreakdown.map((q, i) => ({
        name: `Q${i + 1}`,
        title: q.title,
        avgScore: Number(q.avgScore.toFixed(1)),
        attemptCount: q.attemptCount,
    })), [quizBreakdown])

    const submissionRate = Number(overview.overallSubmissionRate.toFixed(0))
    const radialData = [{ name: 'rate', value: submissionRate, fill: '#3b82f6' }]

    const filteredStudents = useMemo(() => {
        return students.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase())
        )
    }, [students, search])

    const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE))
    const paginatedStudents = useMemo(() => {
        return filteredStudents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    }, [filteredStudents, page])

    const openStudentDetail = async (studentId: number) => {
        setDetailLoading(true)
        try {
            const res = await fetch(`/api/classroom/${classroomId}/analytics/${studentId}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Failed to fetch student metrics")
            setSelectedStudent(data)
        } catch (err) {
            console.error(err)
        } finally {
            setDetailLoading(false)
        }
    }

    const cardBase = "bg-zinc-900/90 border border-zinc-850 rounded-xl p-5 shadow-sm transition-all duration-200"
    
    const coreMetrics = [
        { label: 'Students', value: overview.totalStudents, icon: Users, color: 'text-blue-400 bg-blue-500/10' },
        { label: 'Assignments', value: overview.totalAssignments, icon: ClipboardList, color: 'text-amber-400 bg-amber-500/10' },
        { label: 'Quizzes', value: overview.totalQuizzes, icon: FileQuestion, color: 'text-violet-400 bg-violet-500/10' },
        { label: 'Meetings', value: overview.totalMeetings, icon: Video, color: 'text-sky-400 bg-sky-500/10' },
        { label: 'Announcements', value: overview.totalAnnouncements, icon: Megaphone, color: 'text-pink-400 bg-pink-500/10' },
        { label: 'Submissions', value: overview.totalSubmissionsCount, icon: UploadCloud, color: 'text-emerald-400 bg-emerald-500/10' },
        { label: 'Pending Grading', value: overview.pendingGradingCount, icon: ClipboardCheck, color: 'text-rose-400 bg-rose-500/10' },
    ]

    return (
        <div className='min-h-screen bg-[#121214] py-8 px-4 sm:px-8 text-zinc-100 antialiased overflow-x-hidden'>
            <div className='w-full max-w-[1600px] mx-auto space-y-6'>
                
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-850 pb-5">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className='inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors mb-2.5 group cursor-pointer'
                        >
                            <ArrowLeft className='w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5' />
                            Return to Classrooms
                        </button>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-zinc-900 border border-zinc-850 rounded-lg text-blue-400 hidden sm:block'>
                                <GraduationCap className='size-6' />
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold tracking-tight text-white'>Welcome back, {teacherName}</h1>
                                <p className='text-sm text-zinc-500 font-medium mt-0.5'>
                                    {classroom.className} <span className="text-zinc-800">|</span> Section {classroom.section} <span className="text-zinc-800">|</span> {classroom.semester}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4'>
                    {coreMetrics.map((stat, i) => {
                        const Icon = stat.icon
                        return (
                            <div key={i} className={`${cardBase} !p-4 flex flex-col justify-between group hover:border-zinc-800`}>
                                <div className='flex items-center justify-between gap-2 mb-3'>
                                    <span className='text-[10px] font-bold tracking-wider text-zinc-500 uppercase'>{stat.label}</span>
                                    <div className={`p-1.5 rounded-md ${stat.color}`}>
                                        <Icon className='size-4' />
                                    </div>
                                </div>
                                <p className='text-2xl font-bold tracking-tight text-white mt-auto'>{stat.value}</p>
                            </div>
                        )
                    })}
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    
                    <div className={`${cardBase} lg:col-span-2 flex flex-col justify-between`}>
                        <div>
                            <div className='flex items-center justify-between mb-2'>
                                <h2 className='text-sm font-semibold text-zinc-300 flex items-center gap-2'>
                                    <TrendingUp className='size-4 text-blue-400' />
                                    Assignment Performance Matrix
                                </h2>
                            </div>
                            <div className='flex items-baseline gap-2 mb-6'>
                                <p className='text-4xl font-extrabold tracking-tight text-white'>{overview.avgAssignmentScore.toFixed(1)}</p>
                                <span className='text-xs font-medium text-zinc-500'>Class-wide score average across {overview.totalAssignments} assignments</span>
                            </div>
                        </div>
                        {trendData.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-12 border border-dashed border-zinc-850 rounded-xl bg-zinc-900/20'>
                                <p className='text-xs font-medium text-zinc-600'>No structural assignment telemetry captured yet.</p>
                            </div>
                        ) : (
                            <div className="w-full">
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222226" vertical={false} />
                                        <XAxis dataKey="name" stroke="#52525b" fontSize={11} axisLine={false} tickLine={false} dy={8} />
                                        <YAxis stroke="#52525b" fontSize={11} axisLine={false} tickLine={false} dx={-4} />
                                        <Tooltip
                                            cursor={{ stroke: '#27272a', strokeWidth: 1 }}
                                            contentStyle={{ background: '#18181b', border: '1px solid #27272a', fontSize: 12, borderRadius: 8 }}
                                            labelFormatter={(label) => trendData.find(d => d.name === label)?.title || label}
                                        />
                                        <Area type="monotone" dataKey="avgScore" stroke="#3b82f6" strokeWidth={2} fill="url(#scoreFill)" dot={{ fill: '#3b82f6', r: 3 }} activeDot={{ r: 4, strokeWidth: 0 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    <div className={`${cardBase} flex flex-col justify-between`}>
                        <div>
                            <h2 className='text-sm font-semibold text-zinc-300 mb-1'>Overall Delivery Rate</h2>
                            <p className="text-xs text-zinc-500 mb-4 font-medium">Class workflow submission velocity</p>
                        </div>
                        <div className='relative flex items-center justify-center my-auto'>
                            <ResponsiveContainer width="100%" height={170}>
                                <RadialBarChart innerRadius="75%" outerRadius="105%" data={radialData} startAngle={90} endAngle={-270}>
                                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                    <RadialBar background={{ fill: '#1f1f23' }} dataKey="value" cornerRadius={12} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className='absolute inset-0 flex flex-col items-center justify-center gap-0.5'>
                                <p className='text-3xl font-extrabold tracking-tight text-white'>{submissionRate}%</p>
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Completed</span>
                            </div>
                        </div>
                        <p className='text-xs font-medium text-zinc-500 text-center mt-2 bg-zinc-950/20 border border-zinc-850 rounded-lg py-1.5 px-3'>
                            Logged {overview.totalSubmissionsCount} of {overview.totalAssignments * overview.totalStudents} total tasks
                        </p>
                    </div>
                </div>

                <div className={cardBase}>
                    <div>
                        <h2 className='text-sm font-semibold text-zinc-300 flex items-center gap-2 mb-1'>
                            <BarChart3 className='size-4 text-violet-400' />
                            Evaluated Quiz Analytics
                        </h2>
                    </div>
                    <div className='flex items-baseline gap-2 mb-6'>
                        <p className='text-4xl font-extrabold tracking-tight text-white'>{overview.avgQuizScore.toFixed(1)}</p>
                        <span className='text-xs font-medium text-zinc-500'>Cumulative structural quiz index metric across {overview.totalQuizzes} iterations</span>
                    </div>
                    {quizChartData.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-16 border border-dashed border-zinc-850 rounded-xl bg-zinc-900/20'>
                            <p className='text-xs font-medium text-zinc-600'>No quizzes found matching analytical distributions.</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={quizChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222226" vertical={false} />
                                <XAxis dataKey="name" stroke="#52525b" fontSize={11} axisLine={false} tickLine={false} dy={8} />
                                <YAxis stroke="#52525b" fontSize={11} axisLine={false} tickLine={false} dx={-4} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.01)' }}
                                    contentStyle={{ background: '#18181b', border: '1px solid #27272a', fontSize: 12, borderRadius: 8 }}
                                    labelFormatter={(label) => quizChartData.find(d => d.name === label)?.title || label}
                                    formatter={(value: number) => [`${value}%`, 'Avg Score']}
                                />
                                <Bar dataKey="avgScore" fill="#a78bfa" radius={[4, 4, 0, 0]} maxBarSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {missingSubmissions.length > 0 && (
                    <div className="bg-zinc-900/90 border border-rose-950/30 rounded-xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="size-4 text-rose-400" />
                            <h2 className="text-sm font-semibold text-zinc-200">Students With Missing Assignments</h2>
                            <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 border border-rose-500/20 rounded">
                                Delayed Time Passed
                            </span>
                        </div>
                        <div className="space-y-4">
                            {missingSubmissions.map((assignment) => (
                                <div key={assignment.id} className="border border-zinc-850 bg-zinc-950/40 rounded-lg p-4 space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 pb-2 border-b border-zinc-850/60">
                                        <span className="text-xs font-bold text-zinc-300">{assignment.title}</span>
                                        <span className="text-[11px] text-zinc-500 font-medium">
                                            Due: {new Date(assignment.due_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                        {assignment.missingStudents.map((student) => (
                                            <div key={student.id} className="bg-zinc-900/60 border border-zinc-850 p-2.5 rounded-lg flex items-center justify-between group hover:border-zinc-800 transition-colors">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <AvatarImage src={student.image} alt={student.name} sizeClass="size-7" />
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold text-zinc-300 group-hover:text-white truncate transition-colors">{student.name}</p>
                                                        <p className="text-[10px] text-zinc-500 truncate">{student.email}</p>
                                                    </div>
                                                </div>
                                                <a 
                                                    href={`mailto:${student.email}?subject=Overdue Assignment: ${encodeURIComponent(assignment.title)}`}
                                                    className="p-1.5 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                                                    title={`Contact ${student.name}`}
                                                >
                                                    <Mail className="size-3.5" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-zinc-900/90 border border-zinc-850 rounded-xl p-5 shadow-sm overflow-hidden">
                    <div className='flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-850'>
                        <div className="flex items-center gap-2.5">
                            <h2 className='text-sm font-semibold text-zinc-200'>Student Details</h2>
                            <span className="text-[11px] font-medium text-zinc-300 bg-zinc-800/60 px-2 py-0.5 border border-zinc-700/50 rounded">
                                {filteredStudents.length} {filteredStudents.length === 1 ? 'Student' : 'Students'}
                            </span>
                        </div>
                        <div className='relative w-full sm:w-64'>
                            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500' />
                            <input
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                                placeholder='Search name or email...'
                                className='w-full bg-zinc-850/50 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-750 transition-all'
                            />
                        </div>
                    </div>
                    
                    <div className='overflow-x-auto w-full scrollbar-thin scrollbar-thumb-zinc-800'>
                        <table className='w-full text-sm border-collapse min-w-[800px]'>
                            <thead>
                                <tr className='text-left text-zinc-500 text-[11px] font-bold uppercase tracking-wider border-b border-zinc-850/70'>
                                    <th className='py-4 px-2 text-left'>Student Profile</th>
                                    <th className='py-4 px-2 text-left'>Email Link</th>
                                    <th className='py-4 px-2 text-center'>Task Velocity</th>
                                    <th className='py-4 px-2 text-center'>Avg Task Score</th>
                                    <th className='py-4 px-2 text-center'>Quiz Completion</th>
                                    <th className='py-4 px-2 text-center'>Avg Quiz Index</th>
                                    <th className='py-4 px-2 text-right'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-zinc-850/40'>
                                {paginatedStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className='py-12 text-center text-zinc-600 text-xs font-medium'>
                                            No student metrics match your parameters.
                                        </td>
                                    </tr>
                                ) : paginatedStudents.map((s) => (
                                    <tr key={s.id} className='group hover:bg-zinc-950/30 transition-colors'>
                                        <td className='py-3.5 px-2 whitespace-nowrap'>
                                            <div className='flex items-center gap-3'>
                                                <AvatarImage src={s.image} alt={s.name} sizeClass="size-8" />
                                                <span className='font-semibold text-zinc-300 group-hover:text-white transition-colors'>{s.name}</span>
                                            </div>
                                        </td>
                                        <td className='py-3.5 px-2 text-zinc-400 text-xs font-medium whitespace-nowrap'>{s.email}</td>
                                        <td className='py-3.5 px-2 text-zinc-300 text-center font-medium tabular-nums'>{s.assignmentsSubmitted}/{s.totalAssignments}</td>
                                        <td className='py-3.5 px-2 text-center whitespace-nowrap'>
                                            <span className={`inline-flex items-center justify-center font-bold text-[11px] px-2 py-0.5 rounded border ${
                                                s.avgAssignmentScore === null ? 'bg-zinc-950 text-zinc-500 border-zinc-850' :
                                                s.avgAssignmentScore >= 75 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            }`}>
                                                {s.avgAssignmentScore !== null ? `${s.avgAssignmentScore.toFixed(1)}%` : '—'}
                                            </span>
                                        </td>
                                        <td className='py-3.5 px-2 text-zinc-300 text-center font-medium tabular-nums'>{s.quizzesAttempted}/{s.totalQuizzes}</td>
                                        <td className='py-3.5 px-2 text-center whitespace-nowrap'>
                                            <span className={`inline-flex items-center justify-center font-bold text-[11px] px-2 py-0.5 rounded border ${
                                                s.avgQuizScore === null ? 'bg-zinc-950 text-zinc-500 border-zinc-850' :
                                                s.avgQuizScore >= 75 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            }`}>
                                                {s.avgQuizScore !== null ? `${s.avgQuizScore.toFixed(1)}%` : '—'}
                                            </span>
                                        </td>
                                        <td className='py-3.5 px-2 text-right whitespace-nowrap'>
                                            <button
                                                onClick={() => openStudentDetail(s.id)}
                                                className='inline-flex items-center justify-center size-8 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer'
                                                title="Inspect Metrics"
                                            >
                                                <Eye className='size-4' />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='flex items-center justify-end pt-4 border-t border-zinc-850 text-xs font-medium text-zinc-500'>
                        <div className='flex items-center gap-3.5'>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className='p-1.5 rounded-md border border-zinc-800 bg-zinc-950 text-zinc-400 disabled:opacity-30 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer shadow-sm'
                            >
                                <ChevronLeft className='size-4' />
                            </button>
                            <span className="tabular-nums font-semibold text-zinc-400">{page} <span className="text-zinc-700">/</span> {totalPages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className='p-1.5 rounded-md border border-zinc-800 bg-zinc-950 text-zinc-400 disabled:opacity-30 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer shadow-sm'
                            >
                                <ChevronRight className='size-4' />
                            </button>
                        </div>
                    </div>
                </div>

                {(detailLoading || selectedStudent) && (
                    <div className='fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300' onClick={() => setSelectedStudent(null)}>
                        <div className='bg-zinc-950 border border-zinc-850 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150' onClick={(e) => e.stopPropagation()}>
                            {detailLoading ? (
                                <div className='flex flex-col gap-3 items-center justify-center py-24 text-zinc-500 text-sm font-medium'>
                                    <Loader2 className='size-7 animate-spin text-blue-500' />
                                    Loading Student Details...
                                </div>
                            ) : selectedStudent && (
                                <>
                                    <div className='flex items-start justify-between p-6 border-b border-zinc-850/60 bg-zinc-900/20'>
                                        <div className='flex items-center gap-4'>
                                            <AvatarImage src={selectedStudent.student.image} alt={selectedStudent.student.name} sizeClass="size-12" />
                                            <div>
                                                <h3 className='text-lg font-bold text-white tracking-tight'>{selectedStudent.student.name}</h3>
                                                <p className='text-xs text-zinc-500 mt-0.5 font-medium'>{selectedStudent.student.email}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedStudent(null)} className='p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer'>
                                            <X className='size-5' />
                                        </button>
                                    </div>
                                    
                                    <div className='p-6 overflow-y-auto space-y-6 flex-1 max-h-[calc(85vh-120px)] bg-zinc-950'>
                                        
                                        <div>
                                            <h4 className='text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3'>Assignments Breakdown</h4>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5'>
                                                {selectedStudent.assignments.length === 0 ? (
                                                    <p className='text-xs font-medium text-zinc-600 border border-dashed border-zinc-850 rounded-lg p-3 col-span-2 bg-zinc-900/10'>No assignments assigned.</p>
                                                ) : selectedStudent.assignments.map((a) => (
                                                    <div key={a.id} className='flex items-center justify-between gap-4 text-xs bg-zinc-900 border border-zinc-850 rounded-lg p-3.5'>
                                                        <span className="font-semibold text-zinc-200 truncate max-w-[160px]" title={a.title}>{a.title}</span>
                                                        <span className={`font-bold px-2.5 py-0.5 rounded text-[11px] border tracking-wide whitespace-nowrap ${
                                                            a.submitted 
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                        }`}>
                                                            {a.submitted ? (a.marks !== null ? `${a.marks} pts` : 'Submitted') : 'Missing'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className='text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3'>Quizzes Progress</h4>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5'>
                                                {selectedStudent.quizzes.length === 0 ? (
                                                    <p className='text-xs font-medium text-zinc-600 border border-dashed border-zinc-850 rounded-lg p-3 col-span-2 bg-zinc-900/10'>No quizzes tracked.</p>
                                                ) : selectedStudent.quizzes.map((q) => (
                                                    <div key={q.id} className='flex items-center justify-between gap-4 text-xs bg-zinc-900 border border-zinc-850 rounded-lg p-3.5'>
                                                        <span className="font-semibold text-zinc-200 truncate max-w-[160px]" title={q.title}>{q.title}</span>
                                                        <span className={`font-bold px-2.5 py-0.5 rounded text-[11px] border tracking-wide whitespace-nowrap ${
                                                            q.attempted 
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                        }`}>
                                                            {q.attempted ? `${q.marks} pts` : 'Unattempted'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AnalyticsClient