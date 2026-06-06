"use client"
import React, { useEffect, useState } from 'react'
import '../../allclasses/allclasses.css'
import { GRADIENTS, AVATAR_COLORS, classphoto } from '../../allclasses/page'
import GlowingCard from '@/components/animata/card/glowing-card'
import { useRouter } from 'next/navigation'


const teacherClassroompage = () => {
    const [teachingClassroom,setTeachingClassroom]=useState([])
    const [loading,setLoading]=useState(true)
    const router=useRouter();
    useEffect(()=>{
        const fetchteachingClassrooms =async () =>{
            const res = await fetch("/api/user/classrooms")
            const data=await res.json()
            setTeachingClassroom(data.teachingClassroom)
            setLoading(false)
        }
        fetchteachingClassrooms()
    },[])
    if(loading){
        return(
            <><p>loading..</p></>
        )
    }
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
    </>
  )
}

export default teacherClassroompage
