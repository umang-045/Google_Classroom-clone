"use client"
import { useSession } from 'next-auth/react'
import './dashboard.css'
import React, { useState } from 'react'
import { signOut } from 'next-auth/react'
import CreateClass from '../components/CreateClass'
import JoinClass from '../components/JoinClass'
import { useRouter, usePathname } from 'next/navigation'

const Dashboardlayout = ({ children }) => {
  const router = useRouter()
  const [createclassbox, setcreateclassBox] = useState<boolean>(false)
  const [joinclassbox, setjoinclassBox] = useState<boolean>(false)
  const result = useSession()
  const session = result.data
  const pathname = usePathname()

  const getActive = () => {
    if (pathname === '/dashboard') return 'Dashboard'
    if (pathname.includes('allclasses')) return 'AllClasses'
    if (pathname.includes('enrolled/myclassroom')) return 'EMyClassroom'
    if (pathname.includes('teaching/myclassroom')) return 'TMyClassroom'
    return ''
  }

  return (
    <>
      <div className='DashboardContainer'>
        <div className="sidebar">
          <h1>Digital<span className='Classroom'>Classroom</span></h1>

          <div className='General sidebarComp'>
            <h2>GENERAL</h2>
            <button className={getActive() === 'Dashboard' ? 'active' : ''} onClick={() => router.push('/dashboard')}>🏠 Dashboard</button>
            <button>🔔 Notifications</button>
            <button className={getActive() === 'AllClasses' ? 'active' : ''} onClick={() => router.push("/dashboard/allclasses")}>📚 All Classes</button>
          </div>

          <div className='Enrolled sidebarComp'>
            <h2>ENROLLED</h2>
            <button className={getActive() === 'EMyClassroom' ? 'active' : ''} onClick={() => router.push('/dashboard/enrolled/myclassroom')}>🎓 My Classroom</button>
            <button>📝 Assignments</button>
            <button>📢 Announcements</button>
            <button>💬 Classroom Chat</button>
          </div>

          <div className='Teaching sidebarComp'>
            <h2>TEACHING</h2>
            <button className={getActive() === 'TMyClassroom' ? 'active' : ''} onClick={() => router.push('/dashboard/teaching/myclassroom')}>📖 My Classroom</button>
            <button>📋 Assignments</button>
            <button>📣 Announcements</button>
            <button>💬 Classroom Chat</button>
          </div>

          <div className='Tools sidebarComp'>
            <h2>TOOLS</h2>
            <button>⚙️ Settings</button>
          </div>

          <div className='Profile'>
            <div className=''>UM</div>
            <div>
              <div>Umang</div>
            </div>
          </div>
        </div>
        <div className='mainContent'>
          <div className='Topbar'>
            <div className='Greeting'>
              <h1>Hi 👋, {session?.user?.name ?? "there"}   ! </h1>
              <p>{new Date().toDateString()}</p>
            </div>
            <div className='TopbarButton'>
              <button onClick={() => setjoinclassBox(true)}>🔗 Join Class</button>
              <button onClick={() => setcreateclassBox(true)}>➕ Create Class</button>
              <button onClick={() => {
                const ans = confirm("DO YOU WANT TO SignOut?");
                if (ans) { signOut() }
              }}>🔓Sign Out</button>
            </div>
          </div>
          {children}
        </div>
      </div>
      {createclassbox && <CreateClass setcreateclassBox={setcreateclassBox} />}
      {joinclassbox && <JoinClass setjoinclassBox={setjoinclassBox} />}
    </>
  )
}

export default Dashboardlayout

