import { CallEnd, Mic, MicOff, Videocam, VideocamOff } from "@mui/icons-material"
import { Box, IconButton, Stack } from "@mui/material"
import { addDoc, collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "utils"

const server = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
}

const peer = new RTCPeerConnection(server)

const VideoCall = () => {
    
    let { id, q } = useParams()
    const navigate = useNavigate()
    const [isVideo, setIsVideo] = useState(true)
    const [isAudio, setIsAudio] = useState(true)
    const localVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (id === null && q === null) {
            navigate('/chats')
        }
    }, [id, q, navigate])

    useEffect(() => {
        const setup = async () => {
    
            const dbRef = doc(db, 'calls', id)
            const offerDbRef = collection(db, 'calls', id, 'offerCandidates')
            const answerDbRef = collection(db, 'calls', id, 'answerCandidates')
    
            const localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            // get remote stream
            const rs = new MediaStream()
            peer.ontrack = (e) => {
                e.streams[0].getTracks().forEach(track => {
                    rs.addTrack(track)
                })
            }
            localStream?.getTracks().forEach(track => peer.addTrack(track, localStream))
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream
            }
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = rs
            }
    
    
            if (q === "call") {
    
                peer.onicecandidate = (e) => {
                    if (e.candidate) {
                        console.log('add candidate')
                        addDoc(offerDbRef, {
                            ...e.candidate.toJSON(),
                        })
                    }
                }
                const offerDescription = async () => {
        
                    const offerDesc = await peer.createOffer()
                    await peer.setLocalDescription(offerDesc)
                    const offer = {
                        sdp: offerDesc.sdp,
                        type: offerDesc.type,
                    }
                    await setDoc(dbRef, {
                        offer: offer,
                        time: new Date().toISOString(),
                        status: 'calling',
                    })
        
                }
                offerDescription().then(() => {
                    console.log('offer done')
                })
                onSnapshot(dbRef, (snapshot) => {
                    const data = snapshot.data()
                    if (!peer.currentRemoteDescription && data && data?.answer) {
                        const answerDescription = new RTCSessionDescription(data.answer)
                        peer.setRemoteDescription(answerDescription)
                    }
                })
    
                onSnapshot(answerDbRef, (snapshot) => {
                    snapshot.docChanges().forEach(async (change) => {
                        if (change.type === 'added') {
                            let data = change.doc.data()
                            await peer.addIceCandidate(new RTCIceCandidate(data))
                        }
                    })
                })
            } else {
                peer.onicecandidate = (e) => {
                    if (e.candidate) {
                        addDoc(answerDbRef, {
                            ...e.candidate.toJSON(),
                        })
                    }
                }
                const callData = (await getDoc(dbRef)).data()
                console.log(callData)
                const offerDescription = callData?.offer
                await peer.setRemoteDescription(new RTCSessionDescription(offerDescription))

                const answerDesc = await peer.createAnswer()
                await peer.setLocalDescription(answerDesc)
                const answer = {
                    sdp: answerDesc.sdp,
                    type: answerDesc.type,
                }
                await updateDoc(dbRef, {
                    answer: answer,
                    status: 'answering',
                })

                onSnapshot(offerDbRef, (snapshot) => {
                    snapshot.docChanges().forEach(async (change) => {
                        if (change.type === 'added') {
                            let data = change.doc.data()
                            await peer.addIceCandidate(new RTCIceCandidate(data))
                        }
                    })
                })
            }
    
        }
        setup()
    }, [id, q])


    const handleClickVideo = () => {
        setIsVideo(!isVideo)
        peer.getSenders().forEach(sender => {
            if (sender.track) {
                sender.track.enabled = !isVideo
            }
        })
    }
    const handleClickAudio = () => {
        setIsAudio(!isAudio)
        peer.getSenders().forEach(sender => {
            if (sender.track) {
                sender.track.enabled = !isAudio
            }
        })
    }
    const handleHangeUp = () => {
        peer.close()
        navigate('/chats')
    }

    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                backgroundColor: 'black',
            }}>

            <Stack
                sx={{
                    position: 'absolute',
                    bottom: 20,
                    right: '50%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 2,
                    borderRadius: 2,
                    backgroundColor: 'white',
                    width: 200,
                    zIndex: 100,
                }}
                direction='row'
                spacing={2}>
                <IconButton
                    onClick={handleClickVideo}>
                    {
                        !isVideo ? <VideocamOff /> : <Videocam />
                    }
                </IconButton>
                <IconButton
                    onClick={handleClickAudio}>
                    {
                        !isAudio ? <MicOff/> : <Mic/>
                    }
                </IconButton>
                <IconButton
                    onClick={handleHangeUp}>
                    <CallEnd
                        color="error"/>
                </IconButton>
            </Stack>
            <video
                style={{
                    width: 300,
                    height: "20%",
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    borderRadius: 10,
                }}
                autoPlay
                playsInline
                ref={localVideoRef} />
            <video
                width={'100vw'}
                height={'100%'}
                style={{
                    position: 'absolute',
                }}
                autoPlay
                playsInline
                ref={remoteVideoRef} />
            
        </Box>
    )
}

export { VideoCall }
