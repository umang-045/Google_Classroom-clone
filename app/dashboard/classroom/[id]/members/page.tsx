"use client"
import React, { useState, useEffect } from 'react'
import { classphoto } from '@/app/dashboard/allclasses/page'
import { AVATAR_COLORS } from '@/app/components/ClassroomCard'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

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
    <div className="flex items-center justify-center min-h-[75vh]">
      <Loader2 className="size-6 animate-spin text-gray-400" />
    </div>
  )

  if (!classroomDetails) return null

  return (
    <div className='mx-auto px-4 py-6'>

      {role === "teacher" && requests.length > 0 && (
        <>
          <h2 className='text-xl text-white font-bold'>Pending Requests</h2>
          <hr className='border-gray-500 border-t-2 mb-3' />

          {requests.map((req) => (
            <div key={req.id} className='flex items-center justify-between gap-4 py-3 border-b border-gray-500'>
              <div className='flex items-center gap-4'>
                {req.user.image ? (
                  <img 
                    src={req.user.image} 
                    alt={req.user.name} 
                    className='w-9 h-9 rounded-full object-cover shrink-0' 
                  />
                ) : (
                  <div className='w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center text-white font-medium text-sm shrink-0'>
                    {classphoto(req.user.name)}
                  </div>
                )}
                <div>
                  <p className='text-sm text-white font-medium'>{req.user.name}</p>
                  <p className='text-xs text-gray-400'>{req.user.email}</p>
                </div>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => handleAction(req.id, "approve")}
                  disabled={actionLoading === req.id}
                  className='text-xs px-3 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 disabled:opacity-50'
                >
                  {actionLoading === req.id ? "..." : "Approve"}
                </button>
                <button
                  onClick={() => handleAction(req.id, "reject")}
                  disabled={actionLoading === req.id}
                  className='text-xs px-3 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-50'
                >
                  {actionLoading === req.id ? "..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      <h2 className='text-xl text-white font-bold mt-6'>Teachers</h2>
      <hr className='border-gray-500/40 border-t-2 mb-3' />

      <div className='flex items-center gap-4 py-3'>
        {classroomDetails.teacher.image ? (
          <img 
            src={classroomDetails.teacher.image} 
            alt={classroomDetails.teacher.name} 
            className='w-9 h-9 rounded-full object-cover shrink-0' 
          />
        ) : (
          <div className='w-9 h-9 rounded-full border-gray-600/50 flex items-center justify-center text-white font-medium text-sm shrink-0'>
            {classphoto(classroomDetails.teacher.name)}
          </div>
        )}
        <p className='text-[16px] text-gray-400 font-medium'>{classroomDetails.teacher.name}</p>
      </div>

      <div className='flex items-center justify-between mt-18 mb-2'>
        <h2 className='text-xl text-white font-bold '>Classmates</h2>
        <p className='text-sm text-gray-500'>{classroomDetails.students.length} students</p>
      </div>
      <hr className='border-gray-500/40 border-t-2 mb-3' />

      {classroomDetails.students.map((s: any, i: number) => (
        <div key={i} className='flex items-center gap-4 py-3 border-b border-gray-600/50'>
          {s.user.image ? (
            <img 
              src={s.user.image} 
              className='w-9 h-9 rounded-full object-cover shrink-0' 
            />
          ) : (
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
              {classphoto(s.user.name)}
            </div>
          )}
          <p className='text-[16px] text-white font-medium'>{s.user.name}</p>
        </div>
      ))}

    </div>
  )
}

export default Members