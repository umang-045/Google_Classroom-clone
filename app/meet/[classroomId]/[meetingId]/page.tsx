"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { socket } from '@/lib/socketclient'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2, Users, ScreenShare, ScreenShareOff } from 'lucide-react'
import dynamic from 'next/dynamic'

function classphoto(name = '') {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const MeetRoomComponent = () => {
    const params = useParams()
    const router = useRouter()
    const classroomId = params?.classroomId as string
    const meetingId = params?.meetingId as string
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
    const [participantImages, setParticipantImages] = useState<Record<string, string | null>>({})
    const [remoteVideoTrackStates, setRemoteVideoTrackStates] = useState<Record<string, boolean>>({})
    const [showParticipants, setShowParticipants] = useState(false)

    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null)
    const screenStreamRef = useRef<MediaStream | null>(null)

    const peersRef = useRef<Record<string, any>>({})
    const hasJoinedRef = useRef<boolean>(false)
    const screenSharedToRef = useRef<Set<string>>(new Set())

    const screenVideoRef = useRef<HTMLVideoElement | null>(null)
    const [remoteScreenStreams, setRemoteScreenStreams] = useState<Record<string, MediaStream>>({})
    const hasReceivedCameraRef = useRef<Record<string, boolean>>({})

    const [error, setError] = useState("")
    const [mediaLoading, setMediaLoading] = useState(true)
    const [pinnedId, setPinnedId] = useState<string | null>(null)


    const myImageRef = useRef<string | null>(null)
    useEffect(() => {
        myImageRef.current = myImage
    }, [myImage])

    useEffect(() => {
        if (localVideoRef.current && localstream) {
            localVideoRef.current.srcObject = localstream
        }
    }, [localstream, isScreenSharing, remoteScreenStreams, pinnedId])

    useEffect(() => {
        if (screenVideoRef.current && screenStream) {
            screenVideoRef.current.srcObject = screenStream
        }
    }, [screenStream, isScreenSharing, remoteScreenStreams, pinnedId])

    useEffect(() => {
        if (!classroomId) return
        let isMounted = true

        const fetchRole = async () => {
            try {
                const res = await fetch(`/api/classroom/${classroomId}/role`)
                const data = await res.json()
                if (!res.ok) {
                    if (isMounted) setError(data.message || "Could not verify your access to this classroom")
                    return
                }
                if (isMounted) {
                    setRole(data.role)
                }
            } catch (err) {
                if (isMounted) {
                    setError("Could not verify your access to this classroom")
                }
            }
        }
        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/userprofile`)
                const data = await res.json()
                if (res.ok && isMounted) {
                    setMyName(data.user.name)
                    setMyImage(data.user.image || null)
                }
            } catch (err) { }
        }
        fetchRole()
        fetchProfile()

        return () => { isMounted = false }
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


        peerInstance.on('connect', () => {
            if (myImageRef.current) {
                peerInstance.send(JSON.stringify({ type: 'AVATAR_IMAGE', url: myImageRef.current }))
            }
        })

        peerInstance.on('data', (data: any) => {
            try {
                const parsed = JSON.parse(data.toString())
                if (parsed.type === 'AVATAR_IMAGE') {
                    setParticipantImages((prev) => ({ ...prev, [peerId]: parsed.url }))
                }
            } catch (e) {
                console.error("Failed to parse peer data channel message", e)
            }
        })

        peerInstance.on('stream', (remoteStream) => {
            if (!hasReceivedCameraRef.current[peerId]) {
                hasReceivedCameraRef.current[peerId] = true
                setRemoteStreams((prev) => ({ ...prev, [peerId]: remoteStream }))
            } else {
                setRemoteScreenStreams((prev) => ({ ...prev, [peerId]: remoteStream }))
            }
        })

        peerInstance.on('close', () => {
            handlePeerLeftClean(peerId)
        })

        peerInstance.on('error', (err) => {
            console.error("Peer connection error:", err)
        })

        peersRef.current[peerId] = peerInstance

        if (screenStreamRef.current) {
            try {
                peerInstance.addStream(screenStreamRef.current)
                screenSharedToRef.current.add(peerId)
            } catch (e) {
                console.error("Failed to add screen share track to fresh peer assignment:", e)
            }
        }

        return peerInstance
    }, [])

    const handlePeerLeftClean = useCallback((peerId: string) => {
        if (peersRef.current[peerId]) {
            delete peersRef.current[peerId]
        }
        delete hasReceivedCameraRef.current[peerId]
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
        setParticipantImages((prev) => {
            const copy = { ...prev }
            delete copy[peerId]
            return copy
        })
        setRemoteScreenStreams((prev) => {
            const copy = { ...prev }
            delete copy[peerId]
            return copy
        })
        setRemoteVideoTrackStates((prev) => {
            const copy = { ...prev }
            delete copy[peerId]
            return copy
        })
    }, [])

    useEffect(() => {
        if (!localstream || !myName) return

        if (!hasJoinedRef.current) {
            socket.emit('join-meeting', { room, name: myName, image: myImage })
            hasJoinedRef.current = true
        }

        const handleExistingPeers = (peerList: any[]) => {
            peerList.forEach((peerObj) => {
                const peerId = peerObj.peerId || peerObj.id
                const name = peerObj.name || "Guest"
                const videoActive = peerObj.videoActive

                setParticipantNames((prev) => ({ ...prev, [peerId]: name }))
                if (videoActive !== undefined) {
                    setRemoteVideoTrackStates((prev) => ({ ...prev, [peerId]: videoActive }))
                }
                createPeer(localstream, true, peerId)
            })
        }

        const handlePeerJoined = (data: any) => {
            const peerId = data.peerId || data.id
            const name = data.name || "Guest"

            setParticipantNames((prev) => ({ ...prev, [peerId]: name }))
            createPeer(localstream, false, peerId)
            socket.emit('video-state-sync', { room, videoActive: isVidOn })
        }

        const handleSignal = async ({ from, signal }: { from: string; signal: any }) => {
            let peerInstance = peersRef.current[from]
            if (!peerInstance) {
                peerInstance = await createPeer(localstream, false, from)
            }
            if (peerInstance && !peerInstance.destroyed) {
                try {
                    peerInstance.signal(signal)
                } catch (err) {
                    console.warn(`Signal failed for peer ${from}:`, err)
                }
            }
        }

        const handlePeerLeft = (peerId: string) => {
            if (peersRef.current[peerId]) {
                peersRef.current[peerId].destroy()
            }
            handlePeerLeftClean(peerId)
        }

        const handleScreenShareStatus = ({ peerId, sharing }: { peerId: string; sharing: boolean }) => {
            if (!sharing) {
                setRemoteScreenStreams((prev) => {
                    const copy = { ...prev }
                    delete copy[peerId]
                    return copy
                })
            }
        }

        const handleVideoTrackChange = ({ peerId, videoActive }: { peerId: string; videoActive: boolean }) => {
            setRemoteVideoTrackStates((prev) => ({ ...prev, [peerId]: videoActive }))
        }

        socket.on('existing-peers', handleExistingPeers)
        socket.on('peer-joined', handlePeerJoined)
        socket.on('signal', handleSignal)
        socket.on('peer-left', handlePeerLeft)
        socket.on('screen-share-status', handleScreenShareStatus)
        socket.on('video-track-change', handleVideoTrackChange)

        return () => {
            socket.off('existing-peers', handleExistingPeers)
            socket.off('peer-joined', handlePeerJoined)
            socket.off('signal', handleSignal)
            socket.off('peer-left', handlePeerLeft)
            socket.off('screen-share-status', handleScreenShareStatus)
            socket.off('video-track-change', handleVideoTrackChange)
        }
    }, [localstream, myName, myImage, room, createPeer, handlePeerLeftClean, isVidOn])

    useEffect(() => {
        return () => {
            if (hasJoinedRef.current) {
                socket.emit('leave-meeting', { room })
            }
            Object.values(peersRef.current).forEach((p: any) => p.destroy())
            peersRef.current = {}
        }
    }, [room])

    useEffect(() => {
        let activeStream: MediaStream | null = null

        const getMediaStream = async () => {
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

                activeStream = stream
                setlocalstream(stream)
            } catch (err) {
                setError("Could not access camera/microphone. Please verify browser permissions.")
            } finally {
                setMediaLoading(false)
            }
        }

        getMediaStream()

        return () => {
            if (activeStream) {
                activeStream.getTracks().forEach(track => track.stop())
            }
        }
    }, [])

    const toggleCamera = useCallback(() => {
        if (localstream) {
            const videoTrack = localstream.getVideoTracks()[0]
            if (videoTrack) {
                const nextState = !videoTrack.enabled
                videoTrack.enabled = nextState
                setIsVidOn(nextState)
                socket.emit('toggle-video-track', { room, videoActive: nextState })
            }
        }
    }, [localstream, room])

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
            const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true })

            for (const [peerId, peerInstance] of Object.entries(peersRef.current) as [string, any][]) {
                try {
                    peerInstance.addStream(displayStream)
                    screenSharedToRef.current.add(peerId)
                } catch (err) {
                    console.error(`Could not append stream to peer ${peerId}`, err)
                }
            }

            screenStreamRef.current = displayStream
            setScreenStream(displayStream)
            setIsScreenSharing(true)
            socket.emit('screen-share-status', { room, sharing: true })

            displayStream.getVideoTracks()[0].onended = () => stopScreenShare()

        } catch (err) {
            console.error("Screen share failed or was cancelled:", err)
        }
    }

    const stopScreenShare = async () => {
        if (!screenStreamRef.current) return

        for (const [peerId, peerInstance] of Object.entries(peersRef.current) as [string, any][]) {
            if (screenSharedToRef.current.has(peerId) && !peerInstance.destroyed) {
                try {
                    peerInstance.removeStream(screenStreamRef.current)
                } catch (e) {
                    console.error(e)
                }
            }
        }
        screenSharedToRef.current.clear()

        screenStreamRef.current.getTracks().forEach((t) => t.stop())
        screenStreamRef.current = null
        setScreenStream(null)
        setIsScreenSharing(false)
        socket.emit('screen-share-status', { room, sharing: false })
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
        try {
            await fetch(`/api/meetings/${classroomId}/${meetingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "end" }),
            })
        } catch (e) { console.error(e) }
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
    const spotlightContent = pinnedId
        ? { type: 'camera', id: pinnedId }
        : isScreenSharing
            ? { type: 'screen', id: 'local' }
            : Object.keys(remoteScreenStreams).length > 0
                ? { type: 'screen', id: Object.keys(remoteScreenStreams)[0] }
                : null
    const isAnyoneSharing = isScreenSharing || Object.keys(remoteScreenStreams).length > 0
    const isSpotlightMode = isAnyoneSharing || pinnedId !== null

    return (
        <div className="relative flex flex-col min-h-screen bg-slate-900 text-white">
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
                {isSpotlightMode ? (
                    <div className="flex flex-col lg:flex-row gap-3 w-full max-w-7xl h-[75vh]">

                        <div className="flex-1 relative bg-slate-800 rounded-lg overflow-hidden shadow-lg">
                            {spotlightContent?.type === 'screen' && spotlightContent.id === 'local' && (
                                <>
                                    <video key="main-local-screen" ref={screenVideoRef} autoPlay playsInline className="w-full h-full object-contain" />
                                    <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded">Your Screen</span>
                                </>
                            )}

                            {spotlightContent?.type === 'screen' && spotlightContent.id !== 'local' && (
                                <>
                                    <video autoPlay playsInline className="w-full h-full object-contain" ref={(el) => { if (el) el.srcObject = remoteScreenStreams[spotlightContent.id] }} />
                                    <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded">
                                        {participantNames[spotlightContent.id] || "Guest"}'s Screen
                                    </span>
                                </>
                            )}

                            {spotlightContent?.type === 'camera' && spotlightContent.id === 'local' && (
                                <>
                                    <video key="main-local-cam" ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover transform -scale-x-100 ${isVidOn ? '' : 'hidden'}`} />
                                    {!isVidOn && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                                                {myImage ? <img src={myImage} alt={myName} className="w-full h-full object-cover" /> : <span className="text-xl font-bold text-blue-300">{classphoto(myName || "Me")}</span>}
                                            </div>
                                        </div>
                                    )}
                                    <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded">You</span>
                                </>
                            )}

                            {spotlightContent?.type === 'camera' && spotlightContent.id !== 'local' && remoteStreams[spotlightContent.id] && (
                                <RemoteVideoTile
                                    stream={remoteStreams[spotlightContent.id]}
                                    name={participantNames[spotlightContent.id] || "Guest"}
                                    image={participantImages[spotlightContent.id]}
                                    forceVideoOff={remoteVideoTrackStates[spotlightContent.id] === false}
                                />
                            )}

                            {pinnedId && (
                                <button
                                    onClick={() => setPinnedId(null)}
                                    className="absolute top-2 right-2 text-xs bg-black/60 hover:bg-black/80 text-white px-2 py-1 rounded"
                                >
                                    Unpin
                                </button>
                            )}
                        </div>


                        <div className="flex lg:flex-col gap-2 lg:w-40 w-full overflow-x-auto lg:overflow-y-auto">
                            <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-lg shrink-0 w-32 lg:w-full flex items-center justify-center">
                                <video
                                    key="sidebar-local-cam"
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className={`w-full h-full object-cover transform -scale-x-100 ${isVidOn ? '' : 'hidden'}`}
                                />
                                {!isVidOn && (
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                                        {myImage ? (
                                            <img src={myImage} alt={myName} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-sm font-bold text-blue-300">{classphoto(myName || "Me")}</span>
                                        )}
                                    </div>
                                )}
                                <span className="absolute bottom-1 left-1 text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded">
                                    You {!isMicOn && <MicOff className="inline w-2.5 h-2.5" />}
                                </span>
                            </div>
                            {pinnedId && Object.entries(remoteScreenStreams).map(([peerId, stream]) => (
                                <div key={`${peerId}-screen-sidebar`} className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-lg shrink-0 w-32 lg:w-full">
                                    <video autoPlay playsInline className="w-full h-full object-contain" ref={(el) => { if (el) el.srcObject = stream }} />
                                    <span className="absolute bottom-1 left-1 text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded">
                                        {participantNames[peerId] || "Guest"}'s Screen
                                    </span>
                                </div>
                            ))}

                            {Object.entries(remoteStreams).map(([peerId, stream]) => (
                                <div key={`${peerId}-cam-sidebar`} className="relative group">
                                    <RemoteVideoTile
                                        stream={stream}
                                        name={participantNames[peerId] || "Guest"}
                                        image={participantImages[peerId]}
                                        forceVideoOff={remoteVideoTrackStates[peerId] === false}
                                        small
                                    />
                                    <button
                                        onClick={() => setPinnedId(peerId)}
                                        className="absolute top-1 right-1 text-[10px] bg-black/60 hover:bg-black/80 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Pin
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (

                    <div className={`grid ${gridClass} gap-3 w-full max-w-6xl`}>
                        <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
                            <video
                                key="grid-local-cam"
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-cover transform -scale-x-100 ${isVidOn ? '' : 'hidden'}`}
                            />
                            {!isVidOn && (
                                <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
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
                            <RemoteVideoTile
                                key={`${peerId}-cam-grid`}
                                stream={stream}
                                name={participantNames[peerId] || "Guest"}
                                image={participantImages[peerId]}
                                forceVideoOff={remoteVideoTrackStates[peerId] === false}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showParticipants && (
                <div className="fixed right-4 top-20 bottom-24 w-64 bg-slate-800 border border-white/10 rounded-lg shadow-xl p-4 overflow-y-auto z-40">
                    <h3 className="text-sm font-semibold mb-3">Participants ({totalParticipants})</h3>
                    <div className="flex items-center gap-2 py-2 border-b border-white/5">
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-xs overflow-hidden">
                            {myImage ? (
                                <img src={myImage} alt={myName} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                classphoto(myName || "Me")
                            )}
                        </div>
                        <span className="text-sm">{myName} (You)</span>
                    </div>
                    {Object.entries(participantNames).map(([peerId, name]) => (
                        <div key={peerId} className="flex items-center gap-2 py-2 border-b border-white/5">
                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs overflow-hidden">
                                {participantImages[peerId] ? (
                                    <img src={participantImages[peerId]!} alt={name} className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    classphoto(name)
                                )}
                            </div>
                            <span className="text-sm">{name}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-3 rounded-full shadow-xl border border-white/5 z-50">
                <Button
                    variant='outline'
                    size='icon'
                    className={`rounded-full border-white/10 bg-slate-900/50 text-white hover:bg-slate-800 hover:text-white transition-colors ${!isMicOn ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300' : ''}`}
                    onClick={toggleMic}
                >
                    {isMicOn ? <Mic className='w-4 h-4' /> : <MicOff className='w-4 h-4' />}
                </Button>

                <Button
                    variant='outline'
                    size='icon'
                    className={`rounded-full border-white/10 bg-slate-900/50 text-white hover:bg-slate-800 hover:text-white transition-colors ${!isVidOn ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300' : ''}`}
                    onClick={toggleCamera}
                >
                    {isVidOn ? <Video className='w-4 h-4' /> : <VideoOff className='w-4 h-4' />}
                </Button>

                <Button
                    variant='outline'
                    size='icon'
                    className={`rounded-full border-white/10 bg-slate-900/50 text-white hover:bg-slate-800 hover:text-white transition-colors ${isScreenSharing ? 'border-blue-500/30 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300' : ''}`}
                    onClick={toggleScreenShare}
                >
                    {isScreenSharing ? <ScreenShareOff className='w-4 h-4' /> : <ScreenShare className='w-4 h-4' />}
                </Button>

                <Button
                    variant='outline'
                    size='icon'
                    className={`rounded-full border-white/10 bg-slate-900/50 text-white hover:bg-slate-800 hover:text-white transition-colors ${showParticipants ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}`}
                    onClick={() => setShowParticipants((p) => !p)}
                >
                    <Users className='w-4 h-4' />
                </Button>
            </div>
        </div>
    )
}

function RemoteVideoTile({ stream, name, image, small = false, forceVideoOff = false }: { stream: MediaStream; name: string; image: string | null | undefined; small?: boolean; forceVideoOff?: boolean }) {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [isBlackFrame, setIsBlackFrame] = useState(false)
    const [hasVideoTrack, setHasVideoTrack] = useState(true)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream
        }

        const videoTrack = stream.getVideoTracks()[0]
        setHasVideoTrack(!!videoTrack)

        if (!videoTrack) return

        const canvas = document.createElement('canvas')
        canvas.width = 10
        canvas.height = 10
        const ctx = canvas.getContext('2d')

        let intervalId: any

        const checkFramePixelData = () => {
            if (!videoRef.current || !ctx || videoTrack.enabled === false) {
                setIsBlackFrame(true)
                return
            }

            try {
                ctx.drawImage(videoRef.current, 0, 0, 10, 10)
                const imgData = ctx.getImageData(0, 0, 10, 10).data

                let isPureBlack = true
                for (let i = 0; i < imgData.length; i += 4) {
                    if (imgData[i] > 10 || imgData[i + 1] > 10 || imgData[i + 2] > 10) {
                        isPureBlack = false
                        break
                    }
                }
                setIsBlackFrame(isPureBlack)
            } catch (e) {
                setIsBlackFrame(true)
            }
        }

        intervalId = setInterval(checkFramePixelData, 500)

        return () => {
            clearInterval(intervalId)
        }
    }, [stream])

    const showingVideo = hasVideoTrack && !forceVideoOff && !isBlackFrame

    return (
        <div className={`relative aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-lg shrink-0 flex items-center justify-center ${small ? 'w-32 lg:w-full' : ''}`}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${showingVideo ? '' : 'absolute opacity-0 pointer-events-none'}`}
            />

            {!showingVideo && (
                <div className={`rounded-full bg-slate-700 flex items-center justify-center overflow-hidden ${small ? 'w-10 h-10' : 'w-20 h-20'}`}>
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <span className={small ? 'text-xs font-bold text-white/70' : 'text-xl font-bold text-white/70'}>
                            {classphoto(name)}
                        </span>
                    )}
                </div>
            )}
            <span className={`absolute bottom-1 left-1 text-white bg-black/50 px-1.5 py-0.5 rounded ${small ? 'text-[10px]' : 'text-xs'}`}>{name}</span>
        </div>
    )
}

export default dynamic(() => Promise.resolve(MeetRoomComponent), { ssr: false })