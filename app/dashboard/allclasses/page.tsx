"use client"
import React, { useState, useEffect } from 'react'
import './allclasses.css'
import { useRouter, useSearchParams } from 'next/navigation'
import GlowingCard from '@/components/animata/card/glowing-card'

export const GRADIENTS = [
  'linear-gradient(135deg, #0b3d4f 0%, #117a8b 55%, #36b5c4 100%)',
  'linear-gradient(135deg, #4a1d52 0%, #7a3b8a 55%, #b277c4 100%)',
  'linear-gradient(135deg, #1e2a4a 0%, #3b4d80 55%, #6c7fbf 100%)',
  'linear-gradient(135deg, #1f4d2e 0%, #3a8a5a 55%, #7ac698 100%)',
  'linear-gradient(135deg, #1a8a7a 0%, #1a5a9a 100%)',
  'linear-gradient(135deg, #2d1b4e 0%, #5c3d8f 55%, #8b6abf 100%)',
  'linear-gradient(135deg, #0d3b2e 0%, #1a7a5e 55%, #4db89a 100%)',
  'linear-gradient(135deg, #1a1a4e 0%, #2e2e8f 55%, #5555cc 100%)',
  'linear-gradient(135deg, #3b0d2e 0%, #7a1a5e 55%, #b44d8f 100%)',
  'linear-gradient(135deg, #0d2b3b 0%, #1a5c7a 55%, #3a9abf 100%)',
  'linear-gradient(135deg, #1b3a1b 0%, #2e6e2e 55%, #5aab5a 100%)',
  'linear-gradient(135deg, #2a0d3b 0%, #5c1a7a 55%, #9e4dbf 100%)',
]
export const AVATAR_COLORS = [
  '#0b3d4f', '#4a1d52', '#1e2a4a', '#1f4d2e',
  '#1a5a9a', '#2d1b4e', '#0d3b2e', '#1a1a4e',
  '#3b0d2e', '#0d2b3b', '#1b3a1b', '#2a0d3b',
]

export function classphoto(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const AllClasses = () => {
  const [teachingClassroom, setTeachingClassroom] = useState([])
  const [enrolledClassroom, setEnrolledClassroom] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchClassrooms = async () => {
      const res = await fetch("/api/user/classrooms")
      const data = await res.json()
      setTeachingClassroom(data.teachingClassroom || [])
      setEnrolledClassroom(data.enrolledClassroom || [])
      setLoading(false)
    }
    fetchClassrooms()
  }, [searchParams])

  if (loading) return <p>Loading...</p>


  return (

    <>
      <div className='teaching'>
        <h2 className='heading'>Enrolled as Teacher 🧑‍🏫</h2>
        <div className='classContainer my-2'>
          {teachingClassroom.length === 0
            ? <p className='noClass'>No classrooms created yet!</p>
            : teachingClassroom.map((classroom, colorIndex) => (
              <GlowingCard key={classroom.id}  className='m-auto '>
                <div key={classroom.id} className='classCard ' onClick={() => { router.push(`/dashboard/classroom/${classroom.id}?colorIndex=${colorIndex % GRADIENTS.length}`) }}>
                  <div className='w-full pb-[40px] border-b-2 rounded-2xl p-4' style={{ background: GRADIENTS[colorIndex % GRADIENTS.length] }}>
                    <h3 className='font-bold text-2xl text-white  mb-0.5'>{classroom.className}</h3>
                    <p className='text-xs text-white/50'>{classroom.description}</p>
                    <p className='text-xs text-white/50'>{classroom.semester}</p>
                    <p className='text-xs text-white/50'>Section - {classroom.section}</p>
                  </div>
                  <div className='relative h-[28px]'>
                    <div className='absolute left-[25px] top-[-40px] w-18 h-18 rounded-full border-3 border-black  flex items-center justify-center overflow-hidden' style={{ background: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length] }}>
                      <p className=' text-xl font-bold text-white/30'>{classphoto(classroom.className)}</p>
                    </div>
                  </div>
                  <div className='relative '>
                    <p className='absolute right-0 text-white/50 bg-neutral-800 rounded-xl w-fit p-2 m-2'>{classroom.joinCode}</p>
                  </div>
                </div>
              </GlowingCard>
            ))
          }
        </div>
      </div>

      <div className='enrolled'>
        <h2 className='heading'>Enrolled As Student 🧑‍🎓</h2>
        <div className='classContainer'>
          {enrolledClassroom.map((item, colorIndex) => (
            <GlowingCard key={item.id} className='m-auto'>
              <div className='classCard' onClick={() => router.push(`/dashboard/classroom/${item.classroom.id}?colorIndex=${(teachingClassroom.length + colorIndex) % GRADIENTS.length }`)}>

                <div className='w-full pb-[40px] border-b-2 rounded-2xl p-4'
                  style={{ background: GRADIENTS[(teachingClassroom.length + colorIndex) % GRADIENTS.length] }}>
                  <h3 className='font-bold text-2xl text-white'>{item.classroom.className}</h3>
                  <p className='text-xs text-white/50'>{item.classroom.description}</p>
                  <p className='text-xs text-white/50'>{item.classroom.semester}</p>
                  <p className='text-xs text-white/50'>Section - {item.classroom.section}</p>
                </div>

                <div className='relative h-[28px]'>
                  <div className='absolute left-[25px] top-[-40px] w-18 h-18 rounded-full border-3 border-black bg-white flex items-center justify-center overflow-hidden'style={{ background: AVATAR_COLORS[(teachingClassroom.length+colorIndex) % AVATAR_COLORS.length] }}>
                    <p className='text-xl font-bold text-white/50'>{classphoto(item.classroom.className)}</p>
                  </div>
                </div>

                <div className='relative'>
                  <p className='absolute right-0 text-white/50 bg-neutral-800 rounded-xl w-fit p-2 m-2'>
                    {item.classroom.joinCode}
                  </p>
                </div>

              </div>
            </GlowingCard>
          ))}
        </div>
      </div>
    </>
  )
}

export default AllClasses
