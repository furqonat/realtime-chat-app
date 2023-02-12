import { CallEnd, Mic, MicOff, Videocam, VideocamOff } from "@mui/icons-material"
import { Box, CircularProgress, IconButton, Stack, Typography } from "@mui/material"
import { addDoc, collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import { useUserInfo } from "hooks"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CallState, db, useFirebases } from "utils"

const server = {
    iceServers: [
        {
            urls: "stun:openrelay.metered.ca:80",
        },
        {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
        {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
        {
            urls: "turn:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
    ],
    iceCandidatePoolSize: 10,
}

const peer = new RTCPeerConnection(server)
let localStream: MediaStream = null
let rs: MediaStream = null

const VideoCall = () => {

    let { id, q, callType, receiverUid } = useParams()
    const navigate = useNavigate()
    const [isVideo, setIsVideo] = useState(true)
    const [isAudio, setIsAudio] = useState(true)
    const [connectionState, setConectionState] = useState(CallState.CALLING)
    const localVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)
    const { user } = useFirebases()
    const { userInfo } = useUserInfo({ uid: receiverUid })



    useEffect(() => {
        if (id === null && q === null) {
            navigate('/chats')
        }
    }, [id, q, navigate])

    useEffect(() => {
        if (callType !== 'video') {
            setIsVideo(false)
        }
    }, [callType])

    console.log('id', id)


    useEffect(() => {
        const dbRef = doc(db, 'calls', id)
        const offerDbRef = collection(db, 'calls', id, 'offerCandidates')
        const answerDbRef = collection(db, 'calls', id, 'answerCandidates')


        const setup = async () => {

            localStream = await navigator.mediaDevices.getUserMedia({
                video: callType === 'video',
                audio: true
            })
            // get remote stream
            rs = new MediaStream()
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

                peer.onicecandidate = function (e) {
                    if (e.candidate) {
                        addDoc(offerDbRef, {
                            ...e.candidate.toJSON(),
                        })
                    }
                }

                peer.createOffer()
                    .then((offerDesc) => {
                        peer.setLocalDescription(offerDesc)
                        const offer = {
                            sdp: offerDesc.sdp,
                            type: offerDesc.type,
                        }
                        setDoc(dbRef, {
                            offer: offer,
                            time: new Date().toISOString(),
                            status: 'calling',
                            displayName: user?.displayName,
                            photoURL: user?.photoURL,
                            phoneNumber: user?.phoneNumber,
                            callType: callType,
                            callId: id,
                            seen: false,
                            caller: {
                                displayName: user?.displayName,
                                photoURL: user?.photoURL,
                                phoneNumber: user?.phoneNumber,
                                uid: user?.uid,
                            },
                            receiver: {
                                displayName: userInfo?.displayName,
                                photoURL: userInfo?.photoURL,
                                phoneNumber: userInfo?.phoneNumber,
                                uid: userInfo?.uid
                            }
                        }).then(() => {
                            console.log('offer set')
                        })
                    })

                onSnapshot(dbRef, (snapshot) => {
                    const data = snapshot.data()
                    if (!peer.currentRemoteDescription && data && data?.answer) {
                        const answerDescription = new RTCSessionDescription(data.answer)
                        peer.setRemoteDescription(answerDescription).then(() => {
                            console.log('answer set')
                        })
                    }
                    if (data.status === CallState.ENDED) {
                        // close all media stream
                        localStream?.getTracks().forEach(track => track.stop())
                        peer.close()
                        navigate('/chats')
                    }
                    if (data.status === CallState.REJECTED) {
                        peer.close()
                        localStream?.getTracks().forEach(track => track.stop())
                        navigate('/chats')
                    }
                })


                onSnapshot(answerDbRef, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            const data = change.doc.data()
                            const objectData = JSON.parse(JSON.stringify(data))
                            console.log(objectData)
                            peer.addIceCandidate(new RTCIceCandidate(data))
                                .then(() => {
                                    console.log('ice candidate added')
                                })
                        }
                    })
                })
            } else {
                setConectionState(CallState.CONNECTING)
                peer.onicecandidate = (e) => {
                    if (e.candidate) {
                        addDoc(answerDbRef, {
                            ...e.candidate.toJSON(),
                        })
                    }
                }

                const callData = (await getDoc(dbRef)).data()
                const offerDescription = callData?.offer
                await peer.setRemoteDescription(new RTCSessionDescription(offerDescription))

                peer.createAnswer().then(answerDesc => {
                    peer.setLocalDescription(answerDesc)
                    const answer = {
                        sdp: answerDesc.sdp,
                        type: answerDesc.type,
                    }
                    updateDoc(dbRef, {
                        answer: answer,
                        status: 'answering',
                    }).then(() => {
                        console.log('answer set 193')
                    })
                })

                onSnapshot(offerDbRef, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            let data = change.doc.data()
                            console.log(data, 'hehehe')
                            peer.addIceCandidate(new RTCIceCandidate(data))
                                .then(() => {
                                    console.log('ice candidate added')
                                })
                        }
                    })
                })

                onSnapshot(dbRef, (snapshot) => {
                    const data = snapshot.data()
                    if (data.status === 'ended') {
                        peer.close()
                        navigate('/chats')
                    }
                })

            }

        }
        if (user?.phoneNumber && userInfo?.phoneNumber) {
            setup().then(() => {
                console.log('setup done')
            })
        }

    }, [id, q,
        user?.displayName, user?.photoURL, user?.phoneNumber, user, navigate, callType, receiverUid,
        userInfo?.displayName, userInfo?.photoURL, userInfo?.phoneNumber, userInfo?.uid])


    useEffect(() => {
        // when connectionState is calling and is has been 60 seconds
        // set connectionState to unanswered
        if (connectionState === CallState.CALLING) {
            const timer = setTimeout(() => {
                setConectionState(CallState.UNANSWERED)
                console.log('unanswered')
                const dbRef = doc(db, 'calls', id)
                updateDoc(dbRef, {
                    status: CallState.UNANSWERED,
                }).then(() => {
                    peer.close()
                })
            }, 60000)
            return () => clearTimeout(timer)
        }
        return () => { }
    }, [connectionState, id])

    // when connectionState is unanswered
    // set connectionState to ended
    // and close peer connection
    useEffect(() => {
        if (connectionState === CallState.UNANSWERED) {
            const timer = setTimeout(() => {
                setConectionState(CallState.ENDED)
                localStream?.getTracks().forEach(track => track.stop())
                navigate('/chats')
            }, 10000)
            return () => clearTimeout(timer)
        }
        return () => { }
    }, [connectionState, navigate])

    useEffect(() => {
        peer.onconnectionstatechange = (e) => {
            console.log(peer.connectionState)
            switch (peer.connectionState) {
                case 'new':
                case 'connecting':
                    setConectionState(CallState.CONNECTING)
                    break
                case 'connected':
                    setConectionState(CallState.CONNECTED)
                    break
                case 'disconnected':
                    setConectionState(CallState.DISCONNECTED)
                    break
                case 'failed':
                    peer.restartIce()
                    setConectionState(CallState.FAILED)
                    break
                case 'closed':
                    setConectionState(CallState.CLOSED)
                    break
                default:
                    setConectionState(CallState.CALLING)
                    break
            }
        }
    }, [])

    console.log(connectionState)


    const handleClickVideo = () => {
        setIsVideo(!isVideo)
        localStream.getVideoTracks()[0].enabled = !isVideo
        // peer.getSenders().forEach(sender => {
        //     if (sender.track) {
        //         sender.track.enabled = !isVideo
        //     }
        // })
    }
    const handleClickAudio = () => {
        setIsAudio(!isAudio)
        localStream.getAudioTracks()[0].enabled = !isAudio
        // peer.getSenders().forEach(sender => {
        //     if (sender.track) {
        //         sender.track.enabled = !isAudio
        //     }
        // })
    }
    const handleHangeUp = () => {
        localStream?.getTracks().forEach(track => track.stop())
        peer.close()
        const dbRef = doc(db, 'calls', id)
        updateDoc(dbRef, {
            status: 'ended',
        }).then(() => {
            window.close()
        })
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
                        isVideo && callType === 'video' ? <Videocam /> : <VideocamOff />
                    }
                </IconButton>
                <IconButton
                    onClick={handleClickAudio}>
                    {
                        !isAudio ? <MicOff /> : <Mic />
                    }
                </IconButton>
                <IconButton
                    onClick={handleHangeUp}>
                    <CallEnd
                        color="error" />
                </IconButton>
            </Stack>
            <video
                muted={true}
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
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                }}>
                <video
                    width={'100%'}
                    height={'100%'}
                    style={{
                        position: 'absolute',
                    }}
                    autoPlay
                    playsInline
                    ref={remoteVideoRef} />
                {
                    connectionState !== CallState.CONNECTED &&
                    (
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                            }}>
                            <Typography
                                variant='h5'
                                sx={{
                                    color: 'white',
                                }}>
                                {connectionState}
                            </Typography>
                            <CircularProgress />
                        </Box>
                    )

                }
            </Box>

        </Box>
    )
}

export { VideoCall }
