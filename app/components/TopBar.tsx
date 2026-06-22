import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import CreateClass from '../components/CreateClass'
import JoinClass from '../components/JoinClass'
import { Button } from '@/components/ui/button'

const TopBar = () => {
    const router = useRouter()
    const result = useSession()
    const [createclassbox, setcreateclassBox] = useState<boolean>(false)
    const [joinclassbox, setjoinclassBox] = useState<boolean>(false)
    const session = result.data

    return (
        <>
            <div className="flex w-full flex-row items-center justify-between border-b border-zinc-600/40 bg-zinc-900  p-2 mb-8 font-bold text-white">
                <div>
                    <h2 className="text-[22px] font-bold">Hi, {session?.user?.name ?? "there"} !</h2>
                    <p className=" text-xs tracking-wider text-neutral-400">{new Date().toDateString()}</p>
                </div>

                <div className="flex gap-[50px] items-center">
                    <Button onClick={() => setjoinclassBox(true)} variant="ghost"> Join Class
                    </Button>
                    <Button onClick={() => setcreateclassBox(true)} variant="ghost">
                         Create Class
                    </Button>
                   
                </div>
            </div>

            {createclassbox && <CreateClass setcreateclassBox={setcreateclassBox} />}
            {joinclassbox && <JoinClass setjoinclassBox={setjoinclassBox} />}
        </>
    )
}

export default TopBar
