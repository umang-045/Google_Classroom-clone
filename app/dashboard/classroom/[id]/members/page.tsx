"use client"
import React, { useState, useEffect } from 'react'
import { classphoto } from '@/app/dashboard/allclasses/page'
import { AVATAR_COLORS } from '@/app/components/ClassroomCard'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Loader2, Users } from 'lucide-react'

const Members = () => {
  const router = useRouter();
  const params = useParams()
  const [classroomDetails, setClassroomDetails] = useState<any>(null)
  const [role, setRole] = useState<string>("")
  const [requests, setRequests] = useState<any[]>([])
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const id = params.id

  const fetchClassroomDetails = async (currentRole?: string) => {
    try {
      const res = await fetch(`/api/classroom/${id}`)
      if (!res.ok) {
        router.push('/dashboard/allclasses')
        return
      }
      const data = await res.json()
      setClassroomDetails(data.classroom)
      setRole(data.role)

      if (data.role === "teacher") {
        fetchRequests()
      }
    } catch (error) {
      console.error("Failed to fetch classroom details:", error)
      router.push('/dashboard/allclasses')
    } finally {
      setLoading(false)
    }
  }

  const fetchRequests = async () => {
    try {
      const res = await fetch(`/api/classroom/${id}/requests`)
      const data = await res.json()
      if (res.ok) {
        setRequests(data.requests || [])
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error)
    }
  }

  const handleAction = async (requestId: number, action: "approve" | "reject") => {
    setActionLoading(requestId)
    try {
      const res = await fetch(`/api/classroom/${id}/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.message || "Something went wrong")
        return
      }
      await fetchRequests()
      await fetchClassroomDetails()
    } catch (error) {
      alert("Something went wrong")
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    fetchClassroomDetails()
  }, [id])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] gap-3">
        <div className="relative flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-blue-400 duration-1000" />
        </div>
      
    </div>
  )

  if (!classroomDetails) return null

  return (
    <div className='mx-auto px-4 py-6 text-white max-w-7xl animate-in fade-in duration-300'>

  
      {role === "teacher" && requests.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className='text-xl text-white font-bold tracking-tight'>Pending Requests</h2>
          <hr className='border-white/10 border-t-2 mt-2 mb-3' />

          <div className="divide-y divide-white/10">
            {requests.map((req) => (
              <div key={req.id} className='flex items-center justify-between gap-4 py-3 border-b border-white/5'>
                <div className='flex items-center gap-4'>
                  {req.user.image ? (
                    <img 
                      src={req.user.image} 
                      alt={req.user.name} 
                      className='w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-white/10' 
                    />
                  ) : (
                    <div className='w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white font-medium text-sm shrink-0'>
                      {classphoto(req.user.name)}
                    </div>
                  )}
                  <div>
                    <p className='text-sm text-white font-medium'>{req.user.name}</p>
                    <p className='text-xs text-white/40'>{req.user.email}</p>
                  </div>
                </div>
                <div className='flex gap-2 shrink-0'>
                  <button
                    onClick={() => handleAction(req.id, "approve")}
                    disabled={actionLoading === req.id}
                    className='text-xs px-3 py-1.5 font-medium rounded-md bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50 cursor-pointer'
                  >
                    {actionLoading === req.id ? "..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "reject")}
                    disabled={actionLoading === req.id}
                    className='text-xs px-3 py-1.5 font-medium rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 cursor-pointer'
                  >
                    {actionLoading === req.id ? "..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

     
      <div className={role === "teacher" && requests.length > 0 ? "mt-16" : ""}>
        <h2 className='text-xl text-white font-bold tracking-tight'>Teachers</h2>
        <hr className='border-white/10 border-t-2 mt-2 mb-3' />

        <div className='flex items-center gap-4 py-3'>
          {classroomDetails.teacher.image ? (
            <img 
              src={classroomDetails.teacher.image} 
              alt={classroomDetails.teacher.name} 
              className='w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-white/10' 
            />
          ) : (
            <div className='w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white font-medium text-sm shrink-0'>
              {classphoto(classroomDetails.teacher.name)}
            </div>
          )}
          <p className='text-[16px] text-white/80 font-medium'>{classroomDetails.teacher.name}</p>
        </div>
      </div>

      {/* Classmates Section - Standardized margin-top layout matches above perfectly */}
      <div className='mt-16'>
        <div className='flex items-center justify-between mb-2'>
          <h2 className='text-xl text-white font-bold tracking-tight'>Classmates</h2>
          <p className='text-xs text-white/40 font-medium bg-white/5 border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1'>
            <Users size={12} />
            {classroomDetails.students.length} {classroomDetails.students.length === 1 ? 'student' : 'students'}
          </p>
        </div>
        <hr className='border-white/10 border-t-2 mt-2 mb-3' />

        <div className="divide-y divide-white/5">
          {classroomDetails.students.map((s: any, i: number) => (
            <div key={i} className='flex items-center gap-4 py-3 border-b border-white/5'>
              {s.user.image ? (
                <img 
                  src={s.user.image} 
                  className='w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-white/10' 
                />
              ) : (
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0 shadow-inner ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                  {classphoto(s.user.name)}
                </div>
              )}
              <p className='text-[16px] text-white/80 font-medium'>{s.user.name}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Members