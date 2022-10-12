import {
    AttachFileOutlined, CancelOutlined, EmojiEmotionsOutlined, MicOutlined, SendOutlined
} from "@mui/icons-material"
import { Alert, Box, Collapse, IconButton, Modal, OutlinedInput, Popover } from "@mui/material"
import EmojiPicker from "emoji-picker-react"
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { IChatItem } from "interfaces"
import { FC, useState } from "react"
import { db, useFirebases } from "utils"
import { Mic } from "./mic"

interface IChatInputProps {
    user: IChatItem,
    micClick?: () => void,
}

// TODO: implementation upload image sometime image doesn't upload
// even if it's success the link is broken
const ChatInput: FC<IChatInputProps> = (props) => {

    const [message, setMessage] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const [base64Image, setBase64Image] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [modalImage, setModalImage] = useState(false)
    const [downloadURL, setDownloadURL] = useState("")
    const [error, setError] = useState(false)
    
    const { user } = useFirebases()

    const id = user.uid > props.user.uid ? user.uid + props.user.uid : props.user.uid + user.uid

    const getMessageType = (msg?: string) => {
        if (msg) {
            return "audio"
        } else if (message.trim() !== "") {
            return "text"
        } else {
            return "image"
        }
    }

    const getLastMessageType = (msg?: string) => {
        if (msg) {
            return "Voice Note"
        } else if (message.trim() !== "") {
            return message
        } else {
            return "Image"
        }
    }

    const sendMessage = (msg?: string) => {
        if (message.trim() === '' && msg?.trim() === '') return
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
                    type: getMessageType(msg),
                    read: false,
                    message: {
                        text: msg || message || downloadURL,
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
                            text: getLastMessageType(msg),
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

    const handleChangeInputImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const file = event.target.files?.[0]
        console.log(file)
        if (file) {
            console.log(file, 'file')
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                // if reader.result larger than 3mb show error 
                if ((reader.result as string).length < 3000000) {
                    setBase64Image(reader.result.toString())
                    setImage(file)
                    setModalImage(true)
                } else {
                    setError(true)
                }
            }
        }
    }

    const handleClearImage = () => {
        setBase64Image('')
        setModalImage(false)
    }

    const handleSendImage = () => {
        const storage = getStorage()
        const imageRef = ref(storage, `${user?.phoneNumber}/${id}/${image?.name}`)
        uploadBytes(imageRef, image).then((result) => {
            getDownloadURL(result.ref).then((url) => {
                setDownloadURL(url)
                sendMessage()
                setModalImage(false)
                setBase64Image('')
            })
        })
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
                <IconButton
                    component={'label'}>
                    <input
                        multiple={false}
                        onChange={handleChangeInputImage}
                        type="file" hidden accept="image/*" />
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
            <Modal
                open={modalImage}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        height: 400,
                        background: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        p: 2,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    <Collapse
                        in={error}>
                        <Alert
                            onClose={() => setError(false)}
                            variant={'filled'}>
                            Tidak boleh melebihi dari 3MB
                        </Alert>
                        
                    </Collapse>
                    <img
                        width={300}
                        height={300}
                        src={base64Image} alt="" />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 2,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <IconButton
                            onClick={handleClearImage}>
                            <CancelOutlined />
                        </IconButton>
                        <IconButton
                            onClick={handleSendImage}>
                            <SendOutlined />
                        </IconButton>
                    </Box>
                </Box>
            </Modal>
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
