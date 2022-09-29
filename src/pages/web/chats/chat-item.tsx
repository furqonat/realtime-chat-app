import { base64 } from "@firebase/util";
import { AttachFileOutlined, EmojiEmotionsOutlined, MicOutlined, SendOutlined, StopOutlined } from "@mui/icons-material";
import { Avatar, Box, Card, IconButton, Modal, OutlinedInput, Popover, Stack, Typography } from "@mui/material";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useChats } from "hooks";
import { IChatItem } from "interfaces";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { db, useFirebases } from "utils";

const ChatItem = (props: {user: IChatItem}) => {


    const ref = useRef<HTMLDivElement>(null)
    const { user } = useFirebases()
    
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('text')
    const [openModal, setOpenModal] = useState(false)
    
    const id = user.uid > props.user.uid ? user.uid + props.user.uid : props.user.uid + user.uid
    const { messages } = useChats({ id: id, user: user })

    const sendMessage = () => {
        if (message.trim() === '') return
        const dbRef = doc(db, 'chats', id)
        setDoc(dbRef, {
            id: id,
            users: [user.uid, props.user.uid],
            receiver: {
                uid: props.user.uid,
                displayName: props.user.displayName,
                photoURL: props.user.photoURL,
                phoneNumber: props.user.phoneNumber
            },
            owner: user.uid,
            ownerPhoneNumber: user.phoneNumber,
            ownerDisplayName: user.displayName,
        }, { merge: true })
        
            .then(() => {
                const res = collection(db, 'chats', id, 'messages')
                addDoc(res, {
                    time: new Date().toLocaleTimeString(),
                    type: messageType,
                    read: false,
                    message: {
                        text: message,
                        createdAt: new Date().toISOString(),
                    },
                    sender: {
                        uid: user.uid,
                        displayName: user.displayName,
                        phoneNumber: user.phoneNumber,
                    },
                    receiver: {
                        uid: props.user.uid,
                        displayName: props.user.displayName,
                        phoneNumber: props.user.phoneNumber,
                    }
                }).then(() => {
                    updateDoc(dbRef, {
                        lastMessage: {
                            text: message,
                            createdAt: new Date().toISOString(),
                        }
                    })
                })
            })
        ref.current?.scrollIntoView({ behavior: 'smooth' })
        setMessage('')
    }
    
    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setMessage(event.target.value)
    }
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])
    return (
        <Box
            component={'section'}
            sx={{
            width: '100%',
            display: 'flex',
            height: 'calc(100vh)',
            gap: 2,
            flexFlow: 'column wrap',
            justifyContent: 'space-between'
        }}>
            <Stack
                component={'header'}
                sx={{
                    display: 'flex'
                }}
                spacing={2}>
                <Card
                    variant={'outlined'}
                    sx={{
                        width: '100%',
                        px: 2,
                        background: '#f3f5f7',
                    }}>
                    <Stack spacing={2} direction={'row'} sx={{p: 1}}>
                        <Avatar
                            sx={{ width: 40, height: 40 }}/>
                        <Stack spacing={0} direction={'column'}>
                            <Typography variant={'body1'}>{
                                props.user.displayName ? props.user.displayName : props.user.phoneNumber
                            }</Typography>
                            <Typography variant={'body2'}>
                                {
                                    // get status of user
                                    props.user.status === 'online' ? 'online' : moment(props.user.status).fromNow()
                                }
                            </Typography>
                        </Stack>
                    </Stack>
                </Card>
            </Stack>
            <Stack
                component={'main'}
                sx={{
                    display: 'flex',
                    flex: 1,
                    overflowY: 'scroll',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },
                    flexDirection: 'column-reverse',
                }}>
                <div ref={ref}></div>
                    {
                        messages.map((item, index) => {
                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        m: 1,
                                        flexDirection: item.sender.uid === user.uid ? 'row-reverse' : 'row',
                                    }}>
                                    <Stack spacing={2} direction={'row'} sx={{
                                        p: 1,
                                        boxShadow: 1,
                                        background: item.sender.uid === user.uid ? '#1a237e' : '#fff',
                                        borderRadius: item.sender.uid === user.uid ? '10px 10px 0 10px' : '10px 10px 10px 0',
                                    }}>
                                        <Avatar
                                            sx={{ width: 40, height: 40 }} />
                                        <Stack spacing={0} direction={'column'}>
                                            <Typography
                                                variant={'body1'}
                                                sx={{
                                                    color: item.sender.uid === user.uid ? '#fff' : '#000'
                                                }}
                                            >{
                                                    item.message.text
                                                }
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: item.sender.uid === user.uid ? '#fff' : '#000'
                                                }}
                                                variant={'body2'}>{
                                                    moment(item.message.createdAt).locale('id').fromNow()
                                                }</Typography>
                                        </Stack>
                                    </Stack>
                                </Box>
                            )
                        })
                    }
            
                </Stack>
            <Box
                sx={{
                    width: '100%',
                }}>
                <Box
                    sx={{
                        background: '#f3f5f7',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                        p: 2,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    <IconButton>
                        <EmojiEmotionsOutlined/>
                    </IconButton>
                    <IconButton>
                        <AttachFileOutlined/>
                    </IconButton>
                    <OutlinedInput
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleEnter}
                        size={'small'}
                        sx={{
                            borderRadius: 20,
                            background: 'white',
                        }}
                        placeholder={'Type a message'}
                        fullWidth={true}/>
                    {
                        message.length > 0 ? (
                            <IconButton onClick={() => {
                                setMessageType('text')
                                sendMessage()

                            }}>
                                <SendOutlined />
                            </IconButton>
                        ) :
                            (
                                <IconButton onClick={(event) => {
                                    setMessageType('audio')
                                    // open new modal and record audio
                                    setOpenModal(!openModal)
                                }}>
                                    <MicOutlined />
                                </IconButton>
                            )
                    }
                    <Modal
                        open={openModal}
                        onClose={() => setOpenModal(false)}
                        aria-labelledby={"modal-modal-title"}
                        aria-describedby={"modal-modal-description"}>
                        <AudioUI />
                    </Modal>

                </Box>

            </Box>
        </Box>
    )
}

const AudioUI = () => {

    const [audioURL, setAudioURL] = useState<string>('')
    const [isRecording, setIsRecording] = useState<boolean>(false)
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>()

    const recordAudio = async () => {
        setIsRecording(true)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        setMediaRecorder(mediaRecorder)
        mediaRecorder.start()
        const chunks: Blob[] = []
        const reader = new FileReader()
        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data)
            reader.readAsDataURL(e.data)
        }
        return {
            onStop: (cb: (blob: Blob) => void) => {
                mediaRecorder.onstop = (e) => {
                    const audioBlob = new Blob(chunks, { type: 'audio/ogg' })
                    cb(audioBlob)
                }
            },
            base64: () => {
                return new Promise((resolve, reject) => {
                    reader.onloadend = () => {
                        resolve(reader.result)
                    }
                    reader.onerror = reject
                })
            }
        }
    }


    return (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                p: 4,
                borderRadius: 2
            }}>
            <Stack
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                }}
                spacing={2}>
                <IconButton onClick={() => {
                    if (isRecording) {
                        mediaRecorder?.stop()
                        setIsRecording(false)
                    } else if (audioURL !== '') {
                        setAudioURL('')
                    } else {
                        recordAudio().then((res) => {
                            res.base64().then((res) => {
                                setAudioURL(res as string)
                            })
                        })
                    }
                }}>
                    {
                        isRecording ? <StopOutlined /> : <MicOutlined />
                    }
                </IconButton>
                {
                    audioURL && (
                        <audio controls>
                            <source src={audioURL} type="audio/ogg" />
                        </audio>
                    )
                }
            </Stack>
        </Box>
    )
}

export { ChatItem };
