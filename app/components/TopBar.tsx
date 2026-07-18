"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import CreateClass from '../components/CreateClass'
import JoinClass from '../components/JoinClass'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const TopBar = () => {
    const router = useRouter()
    const result = useSession()
    const [createclassbox, setcreateclassBox] = useState<boolean>(false)
    const [joinclassbox, setjoinclassBox] = useState<boolean>(false)
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const session = result.data

    return (
        <>
            {/* Darkened border profile using border-white/[0.08] for cleaner isolation */}
            <div className="flex w-full flex-row items-center justify-between border-b border-white/[0.08] bg-transparent p-3 sm:p-2 mb-6 sm:mb-8 font-bold text-foreground">
                
                <div className="flex items-center gap-3 min-w-0">
                    <SidebarTrigger className="text-sidebar-foreground/70 hover:text-foreground hover:bg-sidebar-accent cursor-pointer shrink-0" />
                    <Separator orientation="vertical" className="h-4 w-[1px] bg-white/[0.08] self-center shrink-0" />
                    
                    <div className="min-w-0">
                        <h2 className="text-lg sm:text-[22px] font-bold truncate">Hi, {session?.user?.name ?? "there"} !</h2>
                        <p className="text-xs tracking-wider text-muted-foreground">{new Date().toDateString()}</p>
                    </div>
                </div>

                <div className="hidden sm:flex gap-4 items-center">
                    <Button 
                        onClick={() => setjoinclassBox(true)} 
                        className="cursor-pointer px-4 py-2 rounded-xl text-sm font-semibold text-zinc-300 bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-200 active:scale-95 shadow-sm"
                    > 
                        Join Class
                    </Button>
                    <Button 
                        onClick={() => setcreateclassBox(true)} 
                        className="cursor-pointer px-4 py-2 rounded-xl text-sm font-semibold text-zinc-300 bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-200 active:scale-95 shadow-sm"
                    >
                        Create Class
                    </Button>
                </div>

                <div className="relative sm:hidden">
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="p-2 rounded-md hover:bg-sidebar-accent text-foreground cursor-pointer"
                        aria-label="Open menu"
                    >
                        <Menu className="size-6" />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-44 rounded-md border border-white/[0.08] bg-card shadow-lg z-20 flex flex-col overflow-hidden">
                            <button
                                onClick={() => { setjoinclassBox(true); setMenuOpen(false) }}
                                className="px-4 py-2 text-left text-sm font-normal hover:bg-sidebar-accent text-foreground cursor-pointer"
                            >
                                Join Class
                            </button>
                            <button
                                onClick={() => { setcreateclassBox(true); setMenuOpen(false) }}
                                className="px-4 py-2 text-left text-sm font-normal hover:bg-sidebar-accent text-foreground cursor-pointer"
                            >
                                Create Class
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {createclassbox && <CreateClass setcreateclassBox={setcreateclassBox} />}
            {joinclassbox && <JoinClass setjoinclassBox={setjoinclassBox} />}
        </>
    )
}

export default TopBar