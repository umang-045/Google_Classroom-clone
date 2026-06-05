"use client"
import { useSession } from 'next-auth/react'
import './dashboard.css'
import React, { useState } from 'react'
import { signOut } from 'next-auth/react'
import CreateClass from '../components/CreateClass'
import JoinClass from '../components/JoinClass'
import { useRouter, usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

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
        <SidebarProvider>
        <AppSidebar />
        
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
        </SidebarProvider>
      </div>
      {createclassbox && <CreateClass setcreateclassBox={setcreateclassBox} />}
      {joinclassbox && <JoinClass setjoinclassBox={setjoinclassBox} />}
    </>
  )
}

export default Dashboardlayout

