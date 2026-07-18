"use client"
import { useParams, useRouter, usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import '../dashboard/classroom/[id]/id.css'
import { classphoto } from '@/app/components/ClassroomCard'
import FluidTabs from '@/components/animata/tabs/fluid-tabs'
import ClassroomMenu from '@/app/components/ClassroomMenu'
import { classroomProp } from '@/lib/server/classroomDetails'
import { ChevronDown } from 'lucide-react'
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

    const tabItems = [
        { label: 'Announcement', path: `/dashboard/classroom/${id}` },
        { label: 'Assignment', path: `/dashboard/classroom/${id}/assignments` },
        { label: 'Meetings', path: `/dashboard/classroom/${id}/meetings` }, 
        { label: 'Quiz', path: `/dashboard/classroom/${id}/quiz` },
        { label: 'Members', path: `/dashboard/classroom/${id}/members` },
        { label: 'Chat', path: `/dashboard/classroom/${id}/chat` },
    ]
    const activeTabLabel = tabItems[getActiveIndex()]?.label ?? 'Announcement'

    if (!classroomDetails) return <p className="text-center py-10 text-white/60">Classroom not found</p>

    return (
        <>
        <TopBar />
        <div className='w-full flex flex-col gap-3.5 px-6 pb-10 -mt-4'>
            
            <div
                className={`w-full flex justify-between items-center max-md:flex-col relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40 px-8 py-7 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                style={{ backgroundColor: LAYOUT_BOX_BG }}
            >
                <div className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent' />

                <div className='descBox max-md:w-full relative z-10'>
                    <div className='flex items-center gap-3 max-md:justify-center max-md:flex-wrap'>
                        <h1 className='text-white font-extrabold text-3xl tracking-tight max-md:text-2xl max-[480px]:text-xl max-md:text-center max-md:break-words uppercase'>
                            {classroomDetails.className}
                        </h1>
                        <ClassroomMenu role={role} joinCode={classroomDetails.joinCode} id={classroomDetails.id} />
                    </div>
                    
                    <ol className='flex gap-4 mt-2 max-md:flex-wrap max-md:justify-center items-center text-sm text-zinc-400'>
                        <li>Semester <span className='text-zinc-200 font-medium'>{classroomDetails.semester}</span></li>
                        <li className='before:content-["•"] before:mr-4 before:text-zinc-700'>Section <span className='text-zinc-200 font-medium'>{classroomDetails.section}</span></li>
                    </ol>

                    <div className='mt-4 flex max-md:justify-center'>
                        <p className='text-xs font-mono font-medium tracking-wider text-blue-400 bg-blue-500/[0.05] border border-blue-500/20 px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-blue-500/[0.1] hover:border-blue-400/30 select-all cursor-pointer'>
                            Join Code · {classroomDetails.joinCode}
                        </p>
                    </div>
                </div>

                <div className='flex flex-col items-center gap-2 max-md:hidden relative z-10 bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl min-w-[185px]'>
                    {classroomDetails.teacher.image ? (
                        <img
                            src={classroomDetails.teacher.image}
                            alt={classroomDetails.teacher.name}
                            className='w-14 h-14 rounded-full object-cover border-2 border-white/10 shadow-md transition-all duration-300 hover:border-blue-500/40 hover:scale-105'
                        />
                    ) : (
                        <div
                            className='w-14 h-14 rounded-full flex items-center justify-center border border-white/10 shadow-md transition-all duration-300 hover:border-blue-500/40 hover:scale-105'
                            style={{ background: AVATAR_GRADIENT }}
                        >
                            <p className='text-lg font-bold text-white'>{classphoto(classroomDetails.teacher.name)}</p>
                        </div>
                    )}
                    <div className='text-center w-full'>
                        <p className='text-xs font-semibold text-zinc-200 truncate max-w-[160px] mx-auto'>{classroomDetails.teacher.name}</p>
                        <p className='text-[10px] text-zinc-500 mt-0.5 truncate max-w-[160px] mx-auto'>{classroomDetails.teacher.email}</p>
                    </div>
                </div>
            </div>

            <div className="relative w-full max-md:hidden">
                <style dangerouslySetInnerHTML={{__html: `
                    /* Overrides FluidTabs pill container structure safely */
                    .custom-tabs button > div:first-of-type {
                        background-image: linear-gradient(to right, #1d1f27, #14161d) !important;
                        border: 1px solid rgba(255, 255, 255, 0.08) !important;
                        box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.05), 0 8px 16px -6px rgba(0,0,0,0.5) !important;
                        z-index: 10 !important;
                    }
                    /* Locks text properties securely overhead */
                    .custom-tabs button {
                        position: relative !important;
                        z-index: 20 !important;
                        mix-blend-mode: normal !important;
                    }
                `}} />
                
                <FluidTabs
                    className='custom-tabs w-full max-w-full bg-[#111217] border border-white/[0.08] rounded-xl overflow-hidden p-1'
                    defaultActiveIndex={getActiveIndex()}
                >
                    <FluidTabs.List className='w-full flex gap-1 relative z-10'>
                        {tabItems.map((tab, idx) => {
                            const isActive = getActiveIndex() === idx;
                            return (
                                <FluidTabs.Tab
                                    key={tab.path}
                                    className={`cursor-pointer text-sm font-medium transition-colors duration-200 px-5 py-2.5 rounded-lg ${
                                        isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                                    }`}
                                    onClick={() => router.push(tab.path)}
                                >
                                    {/* Forces visibility explicitly through raw nodes */}
                                    <span className={isActive ? 'text-white' : 'text-zinc-400'}>
                                        {tab.label}
                                    </span>
                                </FluidTabs.Tab>
                            )
                        })}
                    </FluidTabs.List>
                </FluidTabs>
            </div>
            
            <div className='relative hidden max-md:block w-full bg-[#111217] border border-white/[0.08] rounded-xl overflow-hidden'>
                <button
                    onClick={() => setTabMenuOpen((prev) => !prev)}
                    className='w-full flex items-center justify-between px-4 py-3.5 text-white font-medium transition-colors hover:bg-white/[0.02]'
                >
                    <span className="text-sm">{activeTabLabel}</span>
                    <ChevronDown className={`size-4 text-zinc-400 transition-transform duration-300 ${tabMenuOpen ? 'rotate-180 text-blue-400' : ''}`} />
                </button>

                <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${tabMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className='overflow-hidden'>
                        <div className='border-t border-white/[0.06] bg-[#0c0d12] flex flex-col p-1'>
                            {tabItems.map((tab) => (
                                <button
                                    key={tab.path}
                                    onClick={() => {
                                        router.push(tab.path)
                                        setTabMenuOpen(false)
                                    }}
                                    className={`px-4 py-2.5 text-left text-sm rounded-lg transition-colors ${tab.label === activeTabLabel ? 'bg-white/[0.06] text-white font-semibold' : 'text-zinc-400 hover:bg-white/[0.02] hover:text-white'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
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