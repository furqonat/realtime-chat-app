window.global ||= window
import { uuidv4 } from "@firebase/util"
import {
    CancelOutlined, EmojiEmotionsOutlined, ImageOutlined, MicOutlined, SendOutlined
} from "@mui/icons-material"
import { Alert, Box, Collapse, IconButton, Modal, OutlinedInput, Popover } from "@mui/material"
import EmojiPicker from "emoji-picker-react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { IChatItem } from "interfaces"
import { FC, useState } from "react"
import { sendMessage, useFirebases } from "utils"
import { Mic } from "./mic"

interface IChatInputProps {
    user: IChatItem,
    micClick?: () => void,
}

const ChatInput: FC<IChatInputProps> = (props) => {

    const [message, setMessage] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const [base64Image, setBase64Image] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [modalImage, setModalImage] = useState(false)
    const [error, setError] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

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

    const getMessageText = (co: { msg?: string, download: string }) => {
        if (message.trim().length > 0) {
            return message
        }
        if (co.msg) {
            return co.msg
        }
        return co.download
    }

    const sendMessages = (msg?: string, imgURL?: string) => {
        if (message.trim() === '' && msg?.trim() === '') return
        sendMessage({
            receiver: props.user,
            user: user,
            message: msg !== undefined ? getMessageText({ msg: msg, download: "" }) : getMessageText({ download: imgURL, msg: "" }),
            type: getMessageType(msg),
            id: id,
            lastMessageType: getLastMessageType(msg),
        })
        setMessage('')
    }

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendMessages()
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
        const file = event.target.files?.[0]
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
        setImage(null)
    }


    const handleSendImage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        e.preventDefault()
        setIsUploading(true)
        const storage = getStorage()
        const imageType = image?.type.split('/')[1]
        const imageRef = ref(storage, `${user?.uid}/${id}/${uuidv4()}.${imageType}`)
        const task = uploadBytesResumable(imageRef, image)
        task.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log(progress, 'progress')
        }, (error) => {
            console.log(error, 'error')
        }, () => {
            getDownloadURL(task.snapshot.ref).then((url) => {
                sendMessages(undefined, url)
                setModalImage(false)
                setBase64Image('')
                setImage(null)
                setIsUploading(false)
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
                        value={''}
                        multiple={false}
                        onChange={handleChangeInputImage}
                        type="file" hidden accept="image/png, image/jpeg, image/jpg image/gif" />
                    <ImageOutlined />
                </IconButton>
                <OutlinedInput
                    autoFocus={true}
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
                            sendMessages()

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
                                sendMessages(res)
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
                        src={base64Image}
                        alt="" />
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
                            onClick={(event) => {
                                if (isUploading) {
                                    console.log('to many action')
                                } else {
                                    handleSendImage(event)
                                }
                            }}>
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
                    p: 2
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

