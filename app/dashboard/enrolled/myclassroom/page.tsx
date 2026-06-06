"use client"
import React, { useEffect, useState } from 'react'
import '../../allclasses/allclasses.css'
import { GRADIENTS, AVATAR_COLORS, classphoto } from '../../allclasses/page'
import GlowingCard from '@/components/animata/card/glowing-card'
import { useRouter } from 'next/navigation'

const enrolledClassroompage = () => {
  const [enrolledClassroom, setenrolledClassroom] = useState([])
  const [loading, setLoading] = useState(true)
  const router=useRouter()
  useEffect(() => {
    const fetchenrolledClassroom = async () => {
      const res = await fetch("/api/user/classrooms")
      const data = await res.json();
      setenrolledClassroom(data.enrolledClassroom || [])
      setLoading(false)
    }
    fetchenrolledClassroom()
  }, [])
  if (loading) {
    return (
      <><p>loading..</p></>
    )
  }

  return (
    <>
      <div className='enrolled'>
        <h2 className='heading'>Enrolled As Student 🧑‍🎓</h2>
        <div className='classContainer'>
          {enrolledClassroom.map((item, colorIndex) => (
            <GlowingCard key={item.id} className='m-auto'>
              <div className='classCard' onClick={() => router.push(`/dashboard/classroom/${item.classroom.id}?colorIndex=${(colorIndex) % GRADIENTS.length}`)}>

                <div className='w-full pb-[40px] border-b-2 rounded-2xl p-4'
                  style={{ background: GRADIENTS[(colorIndex) % GRADIENTS.length] }}>
                  <h3 className='font-bold text-2xl text-white'>{item.classroom.className}</h3>
                  <p className='text-xs text-white/50'>{item.classroom.description}</p>
                  <p className='text-xs text-white/50'>{item.classroom.semester}</p>
                  <p className='text-xs text-white/50'>Section - {item.classroom.section}</p>
                </div>

                <div className='relative h-[28px]'>
                  <div className='absolute left-[25px] top-[-40px] w-18 h-18 rounded-full border-3 border-black bg-white flex items-center justify-center overflow-hidden' style={{ background: AVATAR_COLORS[ colorIndex % AVATAR_COLORS.length] }}>
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

export default enrolledClassroompage
