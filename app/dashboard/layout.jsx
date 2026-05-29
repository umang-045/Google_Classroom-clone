"use client"
import { useSession } from 'next-auth/react'
import './dashboard.css'
import React, { useState } from 'react'
import { signOut } from 'next-auth/react'

const Dashboardlayout = () => {
  const [active, setActive] = useState('Dashboard')
  const result=useSession()
  const session =result.data;
  return (
   <>
   <div className='DashboardContainer'>
    <div className="sidebar">
      <h1>Digital<span className='Classroom'>Classroom</span></h1>

      <div className='General sidebarComp'>
        <h2>GENERAL</h2>
        <button className={active === 'Dashboard' ? 'active' : ''} onClick={() => setActive('Dashboard')}>🏠 Dashboard</button>
        <button className={active === 'Notifications' ? 'active' : ''} onClick={() => setActive('Notifications')}>🔔 Notifications</button>
        <button className={active === 'AllClasses' ? 'active' : ''} onClick={() => setActive('AllClasses')}>📚 All Classes</button>
      </div>

      <div className='Enrolled sidebarComp'>
        <h2>ENROLLED</h2>
        <button className={active === 'EMyClassroom' ? 'active' : ''} onClick={() => setActive('EMyClassroom')}>🎓 My Classroom</button>
        <button className={active === 'EAssignments' ? 'active' : ''} onClick={() => setActive('EAssignments')}>📝 Assignments</button>
        <button className={active === 'EAnnouncements' ? 'active' : ''} onClick={() => setActive('EAnnouncements')}>📢 Announcements</button>
        <button className={active === 'EChat' ? 'active' : ''} onClick={() => setActive('EChat')}>💬 Classroom Chat</button>
      </div>

      <div className='Teaching sidebarComp'>
        <h2>TEACHING</h2>
        <button className={active === 'TMyClassroom' ? 'active' : ''} onClick={() => setActive('TMyClassroom')}>📖 My Classroom</button>
        <button className={active === 'TAssignments' ? 'active' : ''} onClick={() => setActive('TAssignments')}>📋 Assignments</button>
        <button className={active === 'TAnnouncements' ? 'active' : ''} onClick={() => setActive('TAnnouncements')}>📣 Announcements</button>
      </div>

      <div className='Tools sidebarComp'>
        <h2>TOOLS</h2>
        <button className={active === 'Settings' ? 'active' : ''} onClick={() => setActive('Settings')}>⚙️ Settings</button>
      </div>

      <div className='Profile'>
        <div className=''>UM</div>
        <div>
          <div>Umang</div>
        </div>
      </div>
    </div>
    <div className='Topbar'>
      <div className='Greeting'>
      <h1>Hi 👋, {session?.user?.name ?? "there"}   ! </h1>
      <p>{new Date().toDateString()}</p>
      </div>
      <div className='TopbarButton'>
      <button>🔗Join Class</button>
      <button>➕Create Class</button>
       <button onClick={()=>{
        const ans=confirm("DO YOU WANT TO SignOut?");
        if(ans){
          signOut()
        }}}>🔓Sign Out</button>
      </div>      
    </div>
   </div> 
   </>
  )
}

export default Dashboardlayout

