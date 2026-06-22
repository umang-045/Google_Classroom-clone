"use client"
import React, { useState,useEffect } from 'react'
import { classphoto } from '@/app/dashboard/allclasses/page'
import { AVATAR_COLORS } from '@/app/components/ClassroomCard'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'


const Members = () => {
  const router=useRouter();
  const params = useParams()
  const [classroomDetails, setClassroomDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const id = params.id
  
  useEffect(() => {
    const details = async () => {
      try {
        const res = await fetch(`/api/classroom/${id}`)
        if (!res.ok) {
          router.push('/dashboard/allclasses')
          return
        }
        const data = await res.json()
        setClassroomDetails(data.classroom)
      } catch (error) {
        console.error("Failed to fetch classroom details:", error)
        router.push('/dashboard/allclasses')
      } finally {
        setLoading(false)
      }
    }
    details()
  }, [id,router])

  if (loading || !classroomDetails) {
    return <div className="text-white text-center py-10">Loading members...</div>
  }

  return (
    <div className=' mx-auto px-4 py-6'>

      <h2 className='text-xl text-white font-bold'>Teachers</h2>
      <hr className='border-gray-500 border-t-2 mb-3' />

      <div className='flex items-center gap-4 py-3'>
        <div className='w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center text-white font-medium text-sm'>
          {classphoto(classroomDetails.teacher.name)}
        </div>
        <p className='text-sm text-gray-400'>{classroomDetails.teacher.name}</p>
      </div>


      <div className='flex items-center justify-between mt-6 mb-2'>
        <h2 className='text-xl text-white font-bold '>Classmates</h2>
        <p className='text-sm text-gray-500'>{classroomDetails.students.length} students</p>
      </div>
      <hr className='border-gray-500 border-t-2 mb-3' />

      {classroomDetails.students.map((s, i) => (
        <div key={i} className='flex items-center gap-4 py-3 border-b border-gray-500'>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
            {classphoto(s.user.name)}
          </div>
          <p className='text-sm text-white'>{s.user.name}</p>
        </div>
      ))}

    </div>
  )
}

export default Members
