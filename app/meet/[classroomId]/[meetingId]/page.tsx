"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { socket } from '@/lib/socketclient'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2, User, Users, ScreenShare, ScreenShareOff } from 'lucide-react'
import dynamic from 'next/dynamic'

function classphoto(name = '') {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const MeetRoomComponent = () => {
    const params = useParams()
    const router = useRouter()
    const classroomId = params.classroomId as string
    const meetingId = params.meetingId as string
    const room = `meet-${meetingId}`

    const [role, setRole] = useState<string>("")
    const [myName, setMyName] = useState<string>("")
    const [myImage, setMyImage] = useState<string | null>(null)

    const [localstream, setlocalstream] = useState<MediaStream | null>(null)
    const localVideoRef = useRef<HTMLVideoElement | null>(null)
    const [isMicOn, setIsMicOn] = useState<boolean>(true)
    const [isVidOn, setIsVidOn] = useState<boolean>(true)
    const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({})
    const [participantNames, setParticipantNames] = useState<Record<string, string>>({})
    const [showParticipants, setShowParticipants] = useState(false)

    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const screenStreamRef = useRef<MediaStream | null>(null)

    const peersRef = useRef<Record<string, any>>({})
    const hasJoinedRef = useRef<boolean>(false)

    const [error, setError] = useState("")
    const [mediaLoading, setMediaLoading] = useState(true)

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const res = await fetch(`/api/classroom/${classroomId}/role`)
                const data = await res.json()
                if (!res.ok) {
                    setError(data.message || "Could not verify your access to this classroom")
                    return
                }
                setRole(data.role)
            } catch (err) {
                setError("Could not verify your access to this classroom")
            }
        }
        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/userprofile`)
                const data = await res.json()
                if (res.ok) {
                    setMyName(data.user.name)
                    setMyImage(data.user.image)
                }
            } catch (err) { }
        }
        fetchRole()
        fetchProfile()
    }, [classroomId])

    const createPeer = useCallback(async (stream: MediaStream, initiator: boolean, peerId: string) => {
        if (peersRef.current[peerId]) {
            return peersRef.current[peerId]
        }

        const SimplePeer = (await import('simple-peer')).default

        const iceServers: RTCIceServer[] = [
            { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302", "stun:stun3.l.google.com:19302"] }
        ]

        const peerInstance = new SimplePeer({
            stream,
            initiator,
            trickle: true,
            config: { iceServers }
        })

        peerInstance.on('signal', (data) => {
            socket.emit('signal', { to: peerId, signal: data })
        })

        peerInstance.on('stream', (remoteStream) => {
            setRemoteStreams((prev) => ({ ...prev, [peerId]: remoteStream }))
        })

        peerInstance.on('close', () => {
            delete peersRef.current[peerId]
            setRemoteStreams((prev) => {
                const copy = { ...prev }
                delete copy[peerId]
                return copy
            })
            setParticipantNames((prev) => {
                const copy = { ...prev }
                delete copy[peerId]
                return copy
            })
        })

        peerInstance.on('error', (err) => {
            console.error("Peer connection error:", err)
        })

        peersRef.current[peerId] = peerInstance
        return peerInstance
    }, [])

    useEffect(() => {
        if (!localstream || !myName) return

        if (!hasJoinedRef.current) {
            socket.emit('join-meeting', { room, name: myName })
            hasJoinedRef.current = true
        }

        const handleExistingPeers = (peerList: { peerId: string; name: string }[]) => {
            peerList.forEach(({ peerId, name }) => {
                setParticipantNames((prev) => ({ ...prev, [peerId]: name }))
                createPeer(localstream, true, peerId)
            })
        }

        const handlePeerJoined = ({ peerId, name }: { peerId: string; name: string }) => {
            setParticipantNames((prev) => ({ ...prev, [peerId]: name }))
        }

        const handleSignal = async ({ from, signal }: { from: string; signal: any }) => {
            let peerInstance = peersRef.current[from]
            if (!peerInstance) {
                peerInstance = await createPeer(localstream, false, from)
            }
            if (peerInstance && !peerInstance.destroyed) {
                peerInstance.signal(signal)
            }
        }

        const handlePeerLeft = (peerId: string) => {
            peersRef.current[peerId]?.destroy()
            delete peersRef.current[peerId]
            setRemoteStreams((prev) => {
                const copy = { ...prev }
                delete copy[peerId]
                return copy
            })
            setParticipantNames((prev) => {
                const copy = { ...prev }
                delete copy[peerId]
                return copy
            })
        }

        socket.on('existing-peers', handleExistingPeers)
        socket.on('peer-joined', handlePeerJoined)
        socket.on('signal', handleSignal)
        socket.on('peer-left', handlePeerLeft)

        return () => {
            socket.off('existing-peers', handleExistingPeers)
            socket.off('peer-joined', handlePeerJoined)
            socket.off('signal', handleSignal)
            socket.off('peer-left', handlePeerLeft)
        }
    }, [localstream, myName, room, createPeer])

    useEffect(() => {
        return () => {
            if (hasJoinedRef.current) {
                socket.emit('leave-meeting', { room })
            }
            Object.values(peersRef.current).forEach((p: any) => p.destroy())
            peersRef.current = {}
        }
    }, [room])

    const getMediaStream = useCallback(async () => {
        if (localstream) return localstream
        try {
            const devices = await navigator.mediaDevices.enumerateDevices()
            const videoDevices = devices.filter(device => device.kind === 'videoinput')

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 },
                    facingMode: videoDevices.length > 0 ? "user" : undefined
                }
            })

            setlocalstream(stream)
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream
            }
            return stream
        } catch (err) {
            setError("Could not access camera/microphone. Please verify browser permissions.")
        } finally {
            setMediaLoading(false)
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

    const toggleCamera = useCallback(() => {
        if (localstream) {
            const videoTrack = localstream.getVideoTracks()[0]
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled
                setIsVidOn(videoTrack.enabled)
            }
        }
    }, [localstream])

    const toggleMic = useCallback(() => {
        if (localstream) {
            const audioTrack = localstream.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                setIsMicOn(audioTrack.enabled)
            }
        }
    }, [localstream])

    const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
            const screenTrack = screenStream.getVideoTracks()[0]
            const cameraTrack = localstream?.getVideoTracks()[0]

            if (!cameraTrack) return

            Object.values(peersRef.current).forEach((peerInstance: any) => {
                peerInstance.replaceTrack(cameraTrack, screenTrack, localstream)
            })

        
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = screenStream
            }

            screenStreamRef.current = screenStream
            setIsScreenSharing(true)

            
            screenTrack.onended = () => stopScreenShare()

        } catch (err) {
            console.error("Screen share failed or was cancelled:", err)
        }
    }

    const stopScreenShare = () => {
        const cameraTrack = localstream?.getVideoTracks()[0]
        const screenTrack = screenStreamRef.current?.getVideoTracks()[0]
        if (!cameraTrack || !screenTrack) return

        Object.values(peersRef.current).forEach((peerInstance: any) => {
            peerInstance.replaceTrack(screenTrack, cameraTrack, localstream)
        })

        if (localVideoRef.current && localstream) {
            localVideoRef.current.srcObject = localstream
        }

        screenStreamRef.current?.getTracks().forEach((t) => t.stop())
        screenStreamRef.current = null
        setIsScreenSharing(false)
    }

    const toggleScreenShare = () => {
        if (isScreenSharing) {
            stopScreenShare()
        } else {
            startScreenShare()
        }
    }

    const leaveMeeting = () => {
        socket.emit("leave-meeting", { room })
        Object.values(peersRef.current).forEach((pc: any) => pc.destroy())
        peersRef.current = {}
        localstream?.getTracks().forEach((track) => track.stop())
        screenStreamRef.current?.getTracks().forEach((track) => track.stop())
        router.push(`/dashboard/classroom/${classroomId}/meetings?colorIndex=0`)
    }

    const endMeetingForEveryone = async () => {
        await fetch(`/api/meetings/${classroomId}/${meetingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "end" }),
        })
        socket.emit("end-meeting", { room })
        leaveMeeting()
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-red-400 text-sm p-4 text-center">{error}</div>
    }

    if (mediaLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white/70 gap-3">
                <Loader2 className="size-6 animate-spin" />
                <p className="text-sm">Connecting to meeting...</p>
            </div>
        )
    }

    const totalParticipants = 1 + Object.keys(remoteStreams).length
    const gridClass =
        totalParticipants === 1 ? 'grid-cols-1' :
            totalParticipants === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                'grid-cols-2 sm:grid-cols-3'

    return (
        <div className="relative flex flex-col min-h-screen bg-slate-900">
            <nav className="flex items-center justify-between px-6 py-3 bg-slate-950 border-b border-white/10">
                <h1 className="text-lg font-bold">
                    <span className="text-white">Digital</span>
                    <span className="text-blue-400">Classroom</span>
                </h1>

                <div className="flex items-center gap-2">
                    <Button variant='outline' size='sm' onClick={leaveMeeting} className='text-xs gap-1.5'>
                        <PhoneOff className='w-3.5 h-3.5' />
                        Leave
                    </Button>
                    {role === "teacher" && (
                        <Button variant='destructive' size='sm' onClick={endMeetingForEveryone} className='text-xs'>
                            End for Everyone
                        </Button>
                    )}
                </div>
            </nav>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className={`grid ${gridClass} gap-3 w-full max-w-6xl`}>
                    <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover ${isScreenSharing ? '' : 'transform -scale-x-100'} ${isVidOn || isScreenSharing ? '' : 'hidden'}`}
                        />
                        {!isVidOn && !isScreenSharing && (
                            <div className="w-20 h-20 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center overflow-hidden">
                                {myImage ? (
                                    <img src={myImage} alt={myName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xl font-bold text-blue-300">{classphoto(myName || "Me")}</span>
                                )}
                            </div>
                        )}
                        <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded flex items-center gap-1">
                            You {!isMicOn && <MicOff className="w-3 h-3 text-red-400" />}
                        </span>
                    </div>

                    {Object.entries(remoteStreams).map(([peerId, stream]) => (
                        <RemoteVideoTile key={peerId} stream={stream} name={participantNames[peerId] || "Guest"} />
                    ))}
                </div>
            </div>

            {showParticipants && (
                <div className="fixed right-4 top-20 bottom-24 w-64 bg-slate-800 border border-white/10 rounded-lg shadow-xl p-4 overflow-y-auto z-40">
                    <h3 className="text-sm font-semibold mb-3">Participants ({totalParticipants})</h3>
                    <div className="flex items-center gap-2 py-2 border-b border-white/5">
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">
                            {classphoto(myName || "Me")}
                        </div>
                        <span className="text-sm">{myName} (You)</span>
                    </div>
                    {Object.entries(participantNames).map(([peerId, name]) => (
                        <div key={peerId} className="flex items-center gap-2 py-2 border-b border-white/5">
                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs">
                                {classphoto(name)}
                            </div>
                            <span className="text-sm">{name}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-3 rounded-full shadow-xl z-50">
                <Button variant='outline' size='icon' className="rounded-full" onClick={toggleMic}>
                    {isMicOn ? <Mic className='w-4 h-4' /> : <MicOff className='w-4 h-4' />}
                </Button>
                <Button variant='outline' size='icon' className="rounded-full" onClick={toggleCamera}>
                    {isVidOn ? <Video className='w-4 h-4' /> : <VideoOff className='w-4 h-4' />}
                </Button>
                <Button variant='outline' size='icon' className="rounded-full" onClick={toggleScreenShare}>
                    {isScreenSharing ? <ScreenShareOff className='w-4 h-4' /> : <ScreenShare className='w-4 h-4' />}
                </Button>
                <Button variant='outline' size='icon' className="rounded-full" onClick={() => setShowParticipants((p) => !p)}>
                    <Users className='w-4 h-4' />
                </Button>
            </div>
        </div>
    )
}

function RemoteVideoTile({ stream, name }: { stream: MediaStream; name: string }) {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [hasVideo, setHasVideo] = useState(true)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream
        }
        const videoTrack = stream.getVideoTracks()[0]
        if (videoTrack) {
            setHasVideo(videoTrack.enabled)
            const handleTrackState = () => setHasVideo(videoTrack.enabled)
            videoTrack.addEventListener('mute', handleTrackState)
            videoTrack.addEventListener('unmute', handleTrackState)
            return () => {
                videoTrack.removeEventListener('mute', handleTrackState)
                videoTrack.removeEventListener('unmute', handleTrackState)
            }
        }
    }, [stream])

    return (
        <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${hasVideo ? '' : 'hidden'}`} />
            {!hasVideo && (
                <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-white/40" />
                </div>
            )}
            <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded">{name}</span>
        </div>
    )
}

export default dynamic(() => Promise.resolve(MeetRoomComponent), { ssr: false })