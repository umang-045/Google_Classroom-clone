"use client"
import { useParams, useRouter, useSearchParams, usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import './id.css'
import { GRADIENTS, AVATAR_COLORS, classphoto } from '@/app/components/ClassroomCard'
import FluidTabs from '@/components/animata/tabs/fluid-tabs'
import ClassroomMenu from '@/app/components/ClassroomMenu'
import { classroomProp } from '@/app/api/classroom/[id]/route'
import { Loader2, ChevronDown } from 'lucide-react'
import TopBar from '@/app/components/TopBar'


interface Data {
    classroom: classroomProp
    role: string
}

const ClassroomLayout = ({ children }: { children: React.ReactNode }) => {
    const [classroomDetails, setClassroomDetails] = useState<classroomProp | null>(null)
    const [loading, setLoading] = useState(true)
    const [role, setRole] = useState<string>("")
    const [tabMenuOpen, setTabMenuOpen] = useState<boolean>(false)

    const params = useParams()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const id = params.id
    const colorIndex = parseInt(searchParams.get('colorIndex') || '0')


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

    useEffect(() => {
        const details = async () => {
            const res = await fetch(`/api/classroom/${id}`)
            const data: Data = await res.json()
            if (!res.ok) {
                router.push('/dashboard/allclasses')
                return
            }
            setClassroomDetails(data.classroom)
            setRole(data.role)
            setLoading(false)
        }
        details()
    }, [id])

    if (loading) return <div className="flex items-center justify-center min-h-[75vh]">
         <Loader2 className="size-8 animate-spin text-blue-400 duration-1000" />
    </div>
    if (!classroomDetails) return <p className="text-center py-10">Classroom not found</p>

    return (
        <>
        <TopBar />
        <div className='cardContainer'>
            <div className='NameBox max-md:flex-col' style={{ background: GRADIENTS[colorIndex] }}>
                <div className='descBox max-md:w-full'>
                    <div className='flex max-md:justify-center max-md:flex-wrap max-md:gap-2'>
                        <h1 className='text-white font-bold text-2xl mb-1 max-md:text-xl max-[480px]:text-lg max-md:break-words'>{classroomDetails.className}</h1>
                        <ClassroomMenu role={role} joinCode={classroomDetails.joinCode} id={classroomDetails.id} />
                    </div>
                    <ol className='flex list-disc gap-5 ml-2 max-md:flex-wrap max-md:justify-center max-md:gap-3'>
                        <li className='text-xs text-white/70'>Semester: {classroomDetails.semester}</li>
                        <li className='text-xs text-white/70'>Section: {classroomDetails.section}</li>
                    </ol>
                    <p className=' text-xs font-medium mt-1 text-white/70 rounded-xl w-fit max-md:mx-auto'>• Join Code - {classroomDetails.joinCode}</p>
                </div>

                <div className='flex flex-col items-center gap-1 max-md:hidden'>
                    {classroomDetails.teacher.image ? (
                        <img
                            src={classroomDetails.teacher.image}
                            alt={classroomDetails.teacher.name}
                            className='w-16 h-16 rounded-full object-cover border-2 border-white/20'
                        />
                    ) : (
                        <div className='w-16 h-16 rounded-full flex items-center justify-center'
                            style={{ background: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length] }}>
                            <p className='text-xl font-bold text-white'>{classphoto(classroomDetails.teacher.name)}</p>
                        </div>
                    )}
                    <p className='text-xs text-white/70 text-center'>{classroomDetails.teacher.name}</p>
                    <p className='text-xs text-white/70 text-center'>{classroomDetails.teacher.email}</p>
                </div>
            </div>

            <FluidTabs
                className='w-full max-w-full bg-black/50 max-md:hidden'
                defaultActiveIndex={getActiveIndex()}
            >
                <FluidTabs.List className='w-full text-white/70'>
                    <FluidTabs.Tab className='cursor-pointer' onClick={() => router.push(`/dashboard/classroom/${id}?colorIndex=${colorIndex}`)}>Announcement</FluidTabs.Tab>
                    <FluidTabs.Tab className='cursor-pointer' onClick={() => router.push(`/dashboard/classroom/${id}/assignments?colorIndex=${colorIndex}`)}>Assignment</FluidTabs.Tab>
                    <FluidTabs.Tab className='cursor-pointer' onClick={() => router.push(`/dashboard/classroom/${id}/meetings?colorIndex=${colorIndex}`)}>Meetings</FluidTabs.Tab>
                    <FluidTabs.Tab className='cursor-pointer' onClick={() => router.push(`/dashboard/classroom/${id}/quiz?colorIndex=${colorIndex}`)}>Quiz</FluidTabs.Tab>
                    <FluidTabs.Tab className='cursor-pointer' onClick={() => router.push(`/dashboard/classroom/${id}/members?colorIndex=${colorIndex}`)}>Members</FluidTabs.Tab>
                    <FluidTabs.Tab className='cursor-pointer' onClick={() => router.push(`/dashboard/classroom/${id}/chat?colorIndex=${colorIndex}`)}>Chat</FluidTabs.Tab>
                </FluidTabs.List>
            </FluidTabs>

            <div className='relative hidden max-md:block w-full bg-black/50'>
                <button
                    onClick={() => setTabMenuOpen((prev) => !prev)}
                    className='w-full flex items-center justify-between px-4 py-3 text-white font-medium'
                >
                    {activeTabLabel}
                    <ChevronDown className={`size-4 transition-transform ${tabMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {tabMenuOpen && (
                    <div className='absolute left-0 right-0 z-20 bg-zinc-900 border border-zinc-700 shadow-lg flex flex-col'>
                        {tabItems.map((tab) => (
                            <button
                                key={tab.path}
                                onClick={() => {
                                    router.push(`${tab.path}?colorIndex=${colorIndex}`)
                                    setTabMenuOpen(false)
                                }}
                                className={`px-4 py-3 text-left text-sm hover:bg-zinc-800 ${tab.label === activeTabLabel ? 'text-white font-semibold' : 'text-white/70'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4">
                {children}
            </div>
        </div>
        </>
    )
}

export default ClassroomLayout