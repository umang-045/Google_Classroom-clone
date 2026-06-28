"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { socket } from '@/lib/socketclient'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react'

interface SignalPayload {
    from: string
    signal: { type: "offer" | "answer" | "ice"; data: any }
}

const STUN_CONFIG = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
}

const MeetRoom = () => {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const classroomId = params.id as string
    const meetingId = params.meetingId as string
    const colorIndex = searchParams.get('colorIndex') || '0'
    const room = `meet-${meetingId}`

    const [localstream, setlocalstream] = useState<MediaStream | null>(null)
    const localVideoRef = useRef<HTMLVideoElement | null>(null)

    const getMediaStream = useCallback(async () => {
        if (localstream) {
            return localstream
        }
        try {
            const devices = await navigator.mediaDevices.enumerateDevices()
            const videoDevices = devices.filter(device => device.kind === 'videoinput')
            
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: { min: 640, ideal: 1280, max: 1400 },
                    height: { min: 480, ideal: 720, max: 1080 }, // Adjusted to standard video ratios
                    frameRate: { ideal: 30, max: 60 },
                    facingMode: videoDevices.length > 0 ? "user" : undefined
                }
            })
            setlocalstream(stream)
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream
            }
            return stream

        } catch(err) {
           console.error("Error accessing media devices:", err)
        }
    }, [localstream])
    useEffect(() => {
        getMediaStream()

        return () => {
            if (localstream) {
                localstream.getTracks().forEach(track => track.stop())
            }
        }
    }, [getMediaStream])


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
            <div className="relative w-full max-w-2xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                <video 
                    ref={localVideoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover transform -scale-x-100" // Mirrors your webcam naturally
                />
            </div>
        </div>
    )
}

export default MeetRoom