import {
    AttachFileOutlined, EmojiEmotionsOutlined, MicOutlined, SendOutlined
} from "@mui/icons-material"
import { Box, IconButton, OutlinedInput, Popover } from "@mui/material"
import EmojiPicker from "emoji-picker-react"
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore"
import { IChatItem } from "interfaces"
import { FC, useState } from "react"
import { db, useFirebases } from "utils"
import { Mic } from "./mic"

interface IChatInputProps {
    user: IChatItem,
    micClick?: () => void,
}


const ChatInput: FC<IChatInputProps> = (props) => {

    const [message, setMessage] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    
    const { user } = useFirebases()

    const id = user.uid > props.user.uid ? user.uid + props.user.uid : props.user.uid + user.uid

    const sendMessage = (msg?: string) => {
        if (message.trim() === '' && msg.trim() === '') return
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
                    type: msg ? 'audio' : 'text',
                    read: false,
                    message: {
                        text: msg || message,
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
                            text: msg === undefined ? message : "Voice Note",
                            createdAt: new Date().toISOString(),
                        }
                    })
                })
            })
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

    const handleAudio = async (blob: string) => {
        return blob
    }


    const handleEmojiPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }


    return (
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
                <IconButton
                    onClick={handleEmojiPopover}>
                    <EmojiEmotionsOutlined />
                </IconButton>
                <IconButton>
                    <AttachFileOutlined />
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
                    fullWidth={true} />
                {
                    message.length > 0 ? (
                        <IconButton onClick={() => {
                            sendMessage()

                        }}>
                            <SendOutlined />
                        </IconButton>
                    ) :
                        (
                            <IconButton onClick={(event) => {
                                // open new modal and record audio
                                setOpenModal(!openModal)
                                props.micClick && props.micClick()
                            }}>
                                <MicOutlined />
                            </IconButton>
                        )
                }
                <Mic
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    onSend={(blob) => {
                        handleAudio(blob)
                            .then((res) => {
                                sendMessage(res)
                                setOpenModal(false)
                            })
                    }} />

            </Box>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                sx={{
                    p:2
                }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}>
                <EmojiPicker
                    onEmojiClick={(_, emojiObject) => {
                        setMessage(message + emojiObject.emoji)
                    }}
                    native={true}
                />
            </Popover>
        </Box>
    )
}

export { ChatInput }
