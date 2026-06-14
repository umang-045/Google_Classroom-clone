"use client"
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import './id.css'
import { GRADIENTS, AVATAR_COLORS, classphoto } from '@/app/components/ClassroomCard'
import FluidTabs from '@/components/animata/tabs/fluid-tabs'
import ClassroomMenu from '@/app/components/ClassroomMenu'
import { useSession } from 'next-auth/react'
import { classroomProp } from '@/app/api/classroom/[id]/route'
import Members from '@/app/components/Members'
import Assignments from '@/app/components/Assignments'

interface data {
  classroom: classroomProp
  role: string
}

const ClassroomPage = () => {
  const [classroomDetails, setClassroomDetails] = useState<classroomProp | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const id = params.id
  const SearchParams = useSearchParams()
  const colorIndex = parseInt(SearchParams.get('colorIndex'))
  const tabs = ['Stream', 'Assignment', 'Materials', 'Members', 'Chat']
  const [activeTab, setActiveTab] = useState('Stream')
  const session = useSession()
  const [role, setrole] = useState<string>("")
  const router = useRouter()
  useEffect(() => {
    const details = async () => {
      const res = await fetch(`/api/classroom/${id}`)
      const data: data | null = await res.json()
      if (!res.ok) {
        router.push('/dashboard/allclasses')
        return
      }
      setClassroomDetails(data.classroom)
      setrole(data.role)
      setLoading(false)


    }
    details()
  }, [])
  if (loading) return <p>Loading...</p>
  if (!classroomDetails) return <p>Classroom not found</p>


  return (
    <>
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
          className='w-full  max-w-full  bg-black/50'
          defaultActiveIndex={0}
          onActiveIndexChange={(index) => setActiveTab(tabs[index])}
        >
          <FluidTabs.List className='w-full text-white/70  '>
            <FluidTabs.Tab >Stream</FluidTabs.Tab>
            <FluidTabs.Tab>Assignment</FluidTabs.Tab>
            <FluidTabs.Tab>Materials</FluidTabs.Tab>
            <FluidTabs.Tab onClick={() => setActiveTab('Members')}>Members</FluidTabs.Tab>
            <FluidTabs.Tab>Chat</FluidTabs.Tab>
          </FluidTabs.List>
        </FluidTabs>
        {activeTab === 'Stream' && <div>Stream content</div>}
        {activeTab === 'Assignment' && <div><Assignments classroomId={classroomDetails.id} role={role} /></div>}
        {activeTab === 'Materials' && <div>Materials content</div>}
        {activeTab === 'Members' && <Members classroomDetails={classroomDetails} />}
        {activeTab === 'Chat' && <div>Chat content</div>}
      </div >
    </>
  )
}

export default ClassroomPage
