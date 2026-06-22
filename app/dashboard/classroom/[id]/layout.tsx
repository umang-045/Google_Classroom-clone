"use client"
import { useParams, useRouter, useSearchParams, usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import './id.css'
import { GRADIENTS, AVATAR_COLORS, classphoto } from '@/app/components/ClassroomCard'
import FluidTabs from '@/components/animata/tabs/fluid-tabs'
import ClassroomMenu from '@/app/components/ClassroomMenu'
import { classroomProp } from '@/app/api/classroom/[id]/route'


interface Data {
    classroom: classroomProp
    role: string
}

const ClassroomLayout = ({ children }: { children: React.ReactNode }) => {
    const [classroomDetails, setClassroomDetails] = useState<classroomProp | null>(null)
    const [loading, setLoading] = useState(true)
    const [role, setRole] = useState<string>("")
    
    const params = useParams()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    
    const id = params.id
    const colorIndex = parseInt(searchParams.get('colorIndex') || '0')

    
    const getActiveIndex = () => {
        if (pathname === `/dashboard/classroom/${id}`) return 0;
        if (pathname.startsWith(`/dashboard/classroom/${id}/assignments`)) return 1;
        if (pathname.startsWith(`/dashboard/classroom/${id}/materials`)) return 2;
        if (pathname.startsWith(`/dashboard/classroom/${id}/members`)) return 3;
        if (pathname.startsWith(`/dashboard/classroom/${id}/chat`)) return 4;
        return 0;
    }

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

    if (loading) return <p className="text-center py-10">Loading...</p>
    if (!classroomDetails) return <p className="text-center py-10">Classroom not found</p>

    return (
        <div className='cardContainer'>
            <div className='NameBox' style={{ background: GRADIENTS[colorIndex] }}>
                <div className='descBox'>
                    <div className='flex'>
                        <h1 className='text-white font-bold text-2xl mb-1 '>{classroomDetails.className}</h1>
                        <ClassroomMenu role={role} joinCode={classroomDetails.joinCode} id={classroomDetails.id} />
                    </div>
                    <ol className='flex list-disc gap-5 ml-2 '>
                        <li className='text-xs text-white/70'>Semester: {classroomDetails.semester}</li>
                        <li className='text-xs text-white/70'>Section: {classroomDetails.section}</li>
                    </ol>
                    <p className=' text-xs font-medium mt-1 text-white/70 rounded-xl w-fit '>• Join Code - {classroomDetails.joinCode}</p>
                </div>
                
                <div className='flex flex-col items-center gap-1 '>
                    <div className='w-16 h-16 rounded-full flex items-center justify-center'
                        style={{ background: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length] }}>
                        <p className='text-xl font-bold text-white'>{classphoto(classroomDetails.teacher.name)}</p>
                    </div>
                    <p className='text-xs text-white/70 text-center'>{classroomDetails.teacher.name}</p>
                    <p className='text-xs text-white/70 text-center '>{classroomDetails.teacher.email}</p>
                </div>
            </div>

            <FluidTabs
                className='w-full max-w-full bg-black/50'
                defaultActiveIndex={getActiveIndex()}
            >
                <FluidTabs.List className='w-full text-white/70'>
                    <FluidTabs.Tab onClick={() => router.push(`/dashboard/classroom/${id}?colorIndex=${colorIndex}`)}>Stream</FluidTabs.Tab>
                    <FluidTabs.Tab onClick={() => router.push(`/dashboard/classroom/${id}/assignments?colorIndex=${colorIndex}`)}>Assignment</FluidTabs.Tab>
                    <FluidTabs.Tab>Materials</FluidTabs.Tab>
                    <FluidTabs.Tab onClick={()=>  router.push(`/dashboard/classroom/${id}/members?colorIndex=${colorIndex}`) }>Members</FluidTabs.Tab>
                    <FluidTabs.Tab onClick={() => router.push(`/dashboard/classroom/${id}/chat?colorIndex=${colorIndex}`)}>Chat</FluidTabs.Tab>
                </FluidTabs.List>
            </FluidTabs>
            
            <div className="mt-4">
                {children}
            </div>
        </div>
    )
}

export default ClassroomLayout