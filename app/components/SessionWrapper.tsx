"use client"
import React from "react"
import { SessionProvider } from "next-auth/react"

interface SessionWrapperProps {
  children: React.ReactNode;
  session?: any;
}

export const SessionWrapper = ({ children, session }: SessionWrapperProps) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}