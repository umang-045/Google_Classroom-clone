"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ClassroomMenu from './ClassroomMenu'

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
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'
}

const ClassroomCard = ({ Classroomdetails, colorIndex, role, pending = false }) => {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  if (!Classroomdetails) return null

  const paletteIndex = ((colorIndex % GRADIENTS.length) + GRADIENTS.length) % GRADIENTS.length
  const gradient = GRADIENTS[paletteIndex]
  const avatarColor = AVATAR_COLORS[paletteIndex]

  const goToClassroom = () => {
    router.push(`/dashboard/classroom/${Classroomdetails.id}?colorIndex=${paletteIndex}`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      goToClassroom()
    }
  }

  const handleCopyCode = async (e) => {
    e.stopPropagation()
    if (!Classroomdetails.joinCode) return
    try {
      await navigator.clipboard.writeText(Classroomdetails.joinCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div
      role={pending ? undefined : "button"}
      tabIndex={pending ? -1 : 0}
      aria-disabled={pending}
      aria-label={`Open ${Classroomdetails.className}${pending ? ' (waiting for approval)' : ''}`}
      onClick={pending ? undefined : goToClassroom}
      onKeyDown={pending ? undefined : handleKeyDown}
      className={`group relative flex flex-col w-full rounded-2xl border border-white/[0.06] bg-[#121318] overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
        pending 
          ? 'cursor-not-allowed opacity-80' 
          : 'cursor-pointer hover:border-white/[0.15] hover:bg-[#15161c] hover:-translate-y-1 hover:shadow-[0_22px_40px_-15px_rgba(0,0,0,0.7)]'
      }`}
    >
     
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div 
        className='w-full pt-4 px-4 pb-12 sm:pt-5 sm:px-5 sm:pb-14 border-b border-white/[0.05] rounded-t-2xl overflow-hidden relative'
        style={{ background: gradient }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35 pointer-events-none" />

        <div className='flex justify-between items-start gap-3 relative z-10'>
          <h3 title={Classroomdetails.className} className='uppercase font-bold text-xl sm:text-2xl text-white tracking-tight truncate min-w-0'>
            {Classroomdetails.className}
          </h3>
          <div 
            onClick={(e) => e.stopPropagation()} 
            onKeyDown={(e) => e.stopPropagation()} 
            className="opacity-80 hover:opacity-100 transition-all group-hover:scale-105 duration-200 shrink-0"
          >
            <ClassroomMenu role={role} id={Classroomdetails.id} joinCode={Classroomdetails.joinCode} />
          </div>
        </div>

        <div className="relative z-10 mt-2 space-y-0.5 max-w-[85%]">
          {Classroomdetails.description && (
            <p title={Classroomdetails.description} className='text-xs text-white/70 truncate transition-colors group-hover:text-white/90'>
              {Classroomdetails.description}
            </p>
          )}
          {Classroomdetails.semester && (
            <p className='text-xs text-white/60 truncate transition-colors group-hover:text-white/80'>
              {Classroomdetails.semester}
            </p>
          )}
          {Classroomdetails.section && (
            <p className='text-xs text-white/60 truncate transition-colors group-hover:text-white/80'>
              Section {Classroomdetails.section}
            </p>
          )}
        </div>
      </div>

     
      <div className='relative h-6 sm:h-8'>
        <div
          aria-hidden="true"
          className='absolute -top-7 sm:-top-8 left-4 sm:left-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-[#121318] group-hover:border-[#15161c] flex items-center justify-center overflow-hidden shrink-0 transition-all duration-300 group-hover:scale-105 shadow-lg z-10'
          style={{ background: avatarColor }}
        >
          <span className='text-base sm:text-lg font-bold text-white/80 group-hover:text-white transition-colors tracking-wider'>
            {classphoto(Classroomdetails.className)}
          </span>
        </div>
      </div>

      <div className='relative p-3 flex justify-end items-center mt-auto'>
        {Classroomdetails.joinCode && (
          <button
            type="button"
            onClick={handleCopyCode}
            title="Click to copy join code"
            className='text-xs text-white/40 hover:text-white/80 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-lg px-2 py-1 transition-all font-mono tracking-wider flex items-center gap-1.5'
          >
            <span className="truncate max-w-[80px] sm:max-w-[120px]">{Classroomdetails.joinCode}</span>
            <span className="text-[10px] uppercase font-sans text-white/30 tracking-normal shrink-0">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </button>
        )}
      </div>

      {pending && (
        <div className='absolute inset-0 bg-black/70 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-20 transition-all duration-300'>
          <span className='text-xs font-semibold uppercase tracking-wider text-white bg-white/[0.06] px-4 py-2 rounded-full border border-white/10 shadow-xl backdrop-blur-md animate-fade-in'>
            Waiting for approval
          </span>
        </div>
      )}
    </div>
  )
}

export default ClassroomCard