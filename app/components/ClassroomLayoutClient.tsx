"use client"
import { useParams, useRouter, usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import '../dashboard/classroom/[id]/id.css'
import { classphoto } from '@/app/components/ClassroomCard'
import FluidTabs from '@/components/animata/tabs/fluid-tabs'
import ClassroomMenu from '@/app/components/ClassroomMenu'
import { classroomProp } from '@/lib/server/classroomDetails'
import {
    ChevronDown,
    Megaphone,
    FileText,
    Video,
    BrainCircuit,
    Users,
    MessageSquare,
    GraduationCap,
    Layers,
    BarChart3
} from 'lucide-react'
import TopBar from '@/app/components/TopBar'

const LAYOUT_BOX_BG = '#111217'
const AVATAR_GRADIENT = 'linear-gradient(135deg, #1e293b 0%, #2563eb 100%)'

interface ClassroomLayoutClientProps {
    initialClassroomDetails: classroomProp
    initialRole: string
    children: React.ReactNode
}

const ClassroomLayoutClient = ({ initialClassroomDetails, initialRole, children }: ClassroomLayoutClientProps) => {
    const [classroomDetails] = useState<classroomProp | null>(initialClassroomDetails)
    const [role] = useState<string>(initialRole)
    const [tabMenuOpen, setTabMenuOpen] = useState<boolean>(false)
    const [mounted, setMounted] = useState<boolean>(false)
    const [copied, setCopied] = useState<boolean>(false)

    useEffect(() => {
        const raf = requestAnimationFrame(() => setMounted(true))
        return () => cancelAnimationFrame(raf)
    }, [])

    const params = useParams()
    const router = useRouter()
    const pathname = usePathname()

    const id = params.id

    const getActiveIndex = () => {
        if (pathname === `/dashboard/classroom/${id}`) return 0;
        if (pathname.startsWith(`/dashboard/classroom/${id}/assignments`)) return 1;
        if (pathname.startsWith(`/dashboard/classroom/${id}/meetings`)) return 2;
        if (pathname.startsWith(`/dashboard/classroom/${id}/quiz`)) return 3;
        if (pathname.startsWith(`/dashboard/classroom/${id}/members`)) return 4;
        if (pathname.startsWith(`/dashboard/classroom/${id}/chat`)) return 5;
        return 0;
    }

    const handleCopyCode = async () => {
        if (!classroomDetails?.joinCode) return
        try {
            await navigator.clipboard.writeText(classroomDetails.joinCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy code: ', err)
        }
    }

    const tabItems = [
        { label: 'Announcement', path: `/dashboard/classroom/${id}`, icon: Megaphone },
        { label: 'Assignment', path: `/dashboard/classroom/${id}/assignments`, icon: FileText },
        { label: 'Meetings', path: `/dashboard/classroom/${id}/meetings`, icon: Video },
        { label: 'Quiz', path: `/dashboard/classroom/${id}/quiz`, icon: BrainCircuit },
        { label: 'Members', path: `/dashboard/classroom/${id}/members`, icon: Users },
        { label: 'Chat', path: `/dashboard/classroom/${id}/chat`, icon: MessageSquare },
    ]

    const activeIndex = getActiveIndex()
    const activeTab = tabItems[activeIndex] ?? tabItems[0]
    const ActiveIcon = activeTab.icon

    if (!classroomDetails) return <p className="text-center py-10 text-white/60">Classroom not found</p>

    return (
        <>
            <TopBar />
            <div className='w-full flex flex-col gap-5 px-6 pb-10 -mt-4'>

               
                <div
                    className={`w-full flex justify-between items-center max-md:flex-col relative overflow-hidden rounded-2xl border border-white/[0.06] px-8 py-8 transition-all duration-700 ease-out group/card ${mounted
                        ? 'opacity-100 translate-y-0 shadow-[0_0_40px_-15px_rgba(59,130,246,0.2)]'
                        : 'opacity-0 translate-y-2 shadow-none'
                        } hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.35)] hover:border-blue-500/20`}
                    style={{ backgroundColor: LAYOUT_BOX_BG }}
                >
                    <div className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent' />
                    <div className='pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-blue-500/[0.03] blur-[100px] transition-all duration-700 group-hover/card:bg-blue-500/[0.07]' />

                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none mix-blend-overlay" />

                    <div className='descBox max-md:w-full relative z-10'>
                        <div className='flex items-center gap-3.5 max-md:justify-center max-md:flex-wrap'>
                            <h1 className='text-white font-extrabold text-3xl tracking-tight max-md:text-2xl max-[480px]:text-xl max-md:text-center max-md:break-words uppercase'>
                                {classroomDetails.className}
                            </h1>
                            <div className="opacity-90 hover:opacity-100 transition-opacity">
                                <ClassroomMenu role={role} joinCode={classroomDetails.joinCode} id={classroomDetails.id} />
                            </div>
                        </div>

                        <div className='flex gap-2.5 mt-3.5 max-md:flex-wrap max-md:justify-center items-center text-sm text-zinc-400'>
                            <span className='flex items-center gap-2 bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.05]'>
                                <GraduationCap className="size-3.5 text-blue-400/90" />
                                Semester {classroomDetails.semester}
                            </span>
                            <span className='flex items-center gap-2 bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.05]'>
                                <Layers className="size-3.5 text-indigo-400/90" />
                                Section {classroomDetails.section}
                            </span>
                        </div>

                        <div className='mt-4 flex gap-2.5 max-md:justify-center items-center flex-wrap'>
                            <button
                                type="button"
                                onClick={handleCopyCode}
                                title="Click to copy join code"
                                className='text-xs font-mono tracking-wider text-blue-400 bg-blue-500/[0.04] border border-blue-500/15 px-3 py-1.5 rounded-xl transition-all duration-300 hover:bg-blue-500/[0.08] hover:border-blue-400/30 cursor-pointer shadow-sm flex items-center'
                            >
                                Join Code:
                                <span className="text-zinc-200 font-sans tracking-normal font-medium bg-white/[0.06] px-2 py-0.5 rounded-md ml-2 min-w-[50px] text-center transition-all">
                                    {copied ? 'Copied!' : classroomDetails.joinCode}
                                </span>
                            </button>

                            {role === "teacher" && (
                                <button
                                    type="button"
                                    onClick={() => router.push(`/dashboard/analytics/${id}`)}
                                    className='text-xs font-medium tracking-wide text-indigo-400 bg-indigo-500/[0.05] border border-indigo-500/20 px-3 py-1.5 rounded-xl transition-all duration-300 hover:bg-indigo-500/[0.12] hover:border-indigo-400/40 hover:text-indigo-300 hover:scale-[1.02] cursor-pointer shadow-sm flex items-center gap-2 group/analytics'
                                >
                                    <BarChart3 className="size-4.5 text-indigo-400/80 transition-transform duration-300 group-hover/analytics:scale-110 group-hover/analytics:text-indigo-300" />
                                    <span>View Analytics</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className='flex flex-col items-center gap-3 max-md:hidden relative z-10 bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl min-w-[190px] backdrop-blur-md group/avatar transition-all duration-300 hover:border-white/[0.07] hover:bg-white/[0.02]'>
                        {classroomDetails.teacher.image ? (
                            <img
                                src={classroomDetails.teacher.image}
                                alt={classroomDetails.teacher.name}
                                className='w-12 h-12 rounded-full object-cover border border-white/10 shadow-md transition-all duration-300 group-hover/avatar:border-blue-500/30 group-hover/avatar:scale-105'
                            />
                        ) : (
                            <div
                                className='w-12 h-12 rounded-full flex items-center justify-center border border-white/10 shadow-md transition-all duration-300 group-hover/avatar:border-blue-500/30 group-hover/avatar:scale-105'
                                style={{ background: AVATAR_GRADIENT }}
                            >
                                <p className='text-base font-bold text-white'>{classphoto(classroomDetails.teacher.name)}</p>
                            </div>
                        )}
                        <div className='text-center w-full'>
                            <p className='text-xs font-semibold text-zinc-200 truncate max-w-[160px] mx-auto transition-colors group-hover/avatar:text-white'>{classroomDetails.teacher.name}</p>
                            <p className='text-[10px] text-zinc-500 mt-0.5 truncate max-w-[160px] mx-auto tracking-wide font-medium'>{classroomDetails.teacher.email}</p>
                        </div>
                    </div>
                </div>

                <div className="relative w-full max-md:hidden">
                    <style dangerouslySetInnerHTML={{
                        __html: `
                    .custom-tabs button > div:first-of-type {
                        background-image: linear-gradient(to right, #1a1c23, #13141a) !important;
                        border: 1px solid rgba(255, 255, 255, 0.07) !important;
                        box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.03), 0 12px 24px -10px rgba(0,0,0,0.6) !important;
                        z-index: 10 !important;
                    }
                    .custom-tabs button {
                        position: relative !important;
                        z-index: 20 !important;
                        mix-blend-mode: normal !important;
                    }
                `}} />

                    <FluidTabs
                        className='custom-tabs w-full max-w-full bg-[#111217] border border-white/[0.06] rounded-2xl overflow-hidden p-1.5 shadow-xl'
                        defaultActiveIndex={activeIndex}
                    >
                        <FluidTabs.List className='w-full flex gap-1 relative z-10'>
                            {tabItems.map((tab, idx) => {
                                const isActive = activeIndex === idx;
                                const TabIcon = tab.icon;
                                return (
                                    <FluidTabs.Tab
                                        key={tab.path}
                                        className={`cursor-pointer text-sm font-medium transition-all duration-200 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 group/tab ${isActive ? 'text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                                            }`}
                                        onClick={() => router.push(tab.path)}
                                    >
                                        <TabIcon className={`size-4 transition-all duration-300 ${isActive ? 'scale-105 text-blue-400' : 'text-zinc-500 group-hover/tab:text-zinc-400'}`} />
                                        <span className={isActive ? 'text-white' : 'text-zinc-400'}>
                                            {tab.label}
                                        </span>
                                    </FluidTabs.Tab>
                                )
                            })}
                        </FluidTabs.List>
                    </FluidTabs>
                </div>

                <div className='relative hidden max-md:block w-full bg-[#111217] border border-white/[0.06] rounded-xl overflow-hidden shadow-lg'>
                    <button
                        onClick={() => setTabMenuOpen((prev) => !prev)}
                        className='w-full flex items-center justify-between px-4 py-3.5 text-white font-medium transition-colors hover:bg-white/[0.02]'
                    >
                        <div className="flex items-center gap-2.5">
                            <ActiveIcon className="size-4 text-blue-400" />
                            <span className="text-sm tracking-wide">{activeTab.label}</span>
                        </div>
                        <ChevronDown className={`size-4 text-zinc-400 transition-transform duration-300 ${tabMenuOpen ? 'rotate-180 text-blue-400' : ''}`} />
                    </button>

                    <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${tabMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <div className='overflow-hidden'>
                            <div className='border-t border-white/[0.05] bg-[#0c0d12] flex flex-col p-1.5 gap-0.5'>
                                {tabItems.map((tab, idx) => {
                                    const isCurrent = activeIndex === idx;
                                    const MobileTabIcon = tab.icon;
                                    return (
                                        <button
                                            key={tab.path}
                                            onClick={() => {
                                                router.push(tab.path)
                                                setTabMenuOpen(false)
                                            }}
                                            className={`px-4 py-2.5 text-left text-sm rounded-lg transition-colors flex items-center gap-3 ${isCurrent
                                                ? 'bg-white/[0.04] text-white font-medium'
                                                : 'text-zinc-400 hover:bg-white/[0.02] hover:text-white'
                                                }`}
                                        >
                                            <MobileTabIcon className={`size-4 ${isCurrent ? 'text-blue-400' : 'text-zinc-500'}`} />
                                            {tab.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`w-full transition-all duration-500 ease-out delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    {children}
                </div>
            </div>
        </>
    )
}

export default ClassroomLayoutClient