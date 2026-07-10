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
      <div className='DashboardContainer'>
        <SidebarProvider>
        <AppSidebar />
        
        <div className='mainContent'>
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

