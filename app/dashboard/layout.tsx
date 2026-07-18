"use client"
import React, { useState } from 'react'
import './dashboard.css'
import CreateClass from '../components/CreateClass'
import JoinClass from '../components/JoinClass'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

const Dashboardlayout = ({ children }) => {
  const [createclassbox, setcreateclassBox] = useState<boolean>(false)
  const [joinclassbox, setjoinclassBox] = useState<boolean>(false)

  return (
    <>
      <div className='DashboardContainer min-h-screen w-full text-zinc-100 bg-[#111217]'>
        <SidebarProvider> 
          <AppSidebar />
          
          <div className='mainContent min-h-screen overflow-y-auto bg-[#111217]'>
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