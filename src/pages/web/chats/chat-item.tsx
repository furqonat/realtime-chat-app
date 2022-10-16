import { ArrowDropDown, MoreVertOutlined, Phone, Videocam } from "@mui/icons-material";
import {
    Avatar, Box, Card, Dialog, DialogContent, DialogTitle,
    IconButton, MenuItem, Popover, Stack, Typography,
    OutlinedInput, Button, DialogActions
} from "@mui/material";
import { useChats, useContact, useUserStatus } from "hooks";
import { IChatItem } from "interfaces";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteMessage, useFirebases } from "utils"
import { ChatInput } from "./chat-input"

const ChatItem = (props: {user: IChatItem}) => {

    const navigate = useNavigate()

    const ref = useRef<HTMLDivElement>(null)
    const { user } = useFirebases()
    
    const id = user.uid > props.user.uid ? user.uid + props.user.uid : props.user.uid + user.uid
    const callId = id + new Date().getTime()
    const { messages } = useChats({ id: id, user: user })

    const { status } = useUserStatus({ phoneNumber: props.user.phoneNumber })
    const { contact, saveContact } = useContact({ contactId: props.user.uid, user: user })

    const [moreEl, setMoreEl] = useState<null | HTMLElement>(null)
    const [messageOptionsEl, setMessageOptionsEl] = useState<null | HTMLElement>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [openDialog, setOpenDialog] = useState(false)

    const [name, setName] = useState(props.user?.displayName || '')



   
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleClickVideoCam = useCallback(() => {
        navigate(`/video-call/${callId}/call/video`)
    }, [navigate, callId])
    
    const handleClickCall = useCallback(() => {
        navigate(`/video-call/${callId}/call/voice`)
    }, [navigate, callId])

    const handleOpenMore = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMoreEl(event.currentTarget)
    }

    const handleOpenMessageOptionEl = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        setMessageOptionsEl(event.currentTarget)
        setSelectedId(id)
    }

    const handleDeleteMessage = () => {
            deleteMessage({
                id: id, messageId: selectedId, user: user,
                receiver: props.user
            }).then(() => {
            })
            setMessageOptionsEl(null)
    }

    const getContactNameOrPhoneNumber = () => {
        if (contact?.displayName) {
            return contact.displayName
        } else {
            return props.user.phoneNumber
        }
    }

    const handleAddContact = () => {
        saveContact({
            displayName: name,
            phoneNumber: props.user.phoneNumber,
            uid: props.user.uid
        }).then(() => {
            setOpenDialog(false)
        })
    }

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
                    display: 'flex',
                }}
                spacing={2}>
                <Card
                    variant={'outlined'}
                    sx={{
                        width: '100%',
                        px: 2,
                        background: '#f3f5f7',
                    }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <Stack spacing={2} direction={'row'} sx={{ p: 1 }}>
                            <Avatar
                                sx={{ width: 40, height: 40 }} />
                            <Stack spacing={0} direction={'column'}>
                                <Typography variant={'body1'}>{
                                    getContactNameOrPhoneNumber()
                                }</Typography>
                                <Typography variant={'body2'}>
                                    {
                                        // get status of user
                                        status === 'online' ? 'online' : status !== "" ? moment(status).fromNow() : ""
                                    }
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack spacing={1} direction={'row'}>
                            <IconButton
                                onClick={handleClickVideoCam}>
                                <Videocam />
                            </IconButton>
                            <IconButton
                                onClick={handleClickCall}>
                                <Phone />
                            </IconButton>
                            <IconButton
                                onClick={handleOpenMore}>
                                <MoreVertOutlined />
                            </IconButton>
                        </Stack>
                    </Box>
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
                        if (item.visibility[user.uid] === true) {
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
                                        <Stack spacing={0} direction={'column'}>
                                            <Stack
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                                spacing={0}
                                                direction={'row'}>
                                                {
                                                    item.type === 'text' && (
                                                        <Typography
                                                            variant={'body1'}
                                                            sx={{
                                                                color: item.sender.uid === user.uid ? '#fff' : '#000'
                                                            }}>
                                                            {
                                                                item.message.text
                                                            }
                                                        </Typography>
                                                    )
                                                }
                                                {
                                                    item.type === 'audio' && (
                                                        <audio
                                                            key={index + '2'}
                                                            src={item.message.text}
                                                            controls>
                                                        </audio>
                                                    )
                                                }
                                                {
                                                    item.type === 'image' && (
                                                        <img
                                                            key={index + '1'}
                                                            src={item.message.text}
                                                            alt={item.message.text}
                                                            style={{
                                                                width: '150px',
                                                                height: '150px',
                                                                objectFit: 'cover'
                                                            }} />
                                                    )
                                                }
                                                <IconButton
                                                    size={'small'}
                                                    onClick={(event) => {
                                                        handleOpenMessageOptionEl(event, item.id)
                                                    }}
                                                    sx={{
                                                        color: item.sender.uid === user.uid ? '#fff' : '#000'
                                                    }}>
                                                    <ArrowDropDown />
                                                </IconButton>
                                            </Stack>
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
                        } else {
                            return null
                        }
                    })
                }

            </Stack>
            <ChatInput
                user={props.user} />
            
            <Popover
                open={Boolean(messageOptionsEl)}
                anchorEl={messageOptionsEl}
                onClose={() => setMessageOptionsEl(null)}>
                <Stack direction={'column'}>
                    <MenuItem
                        onClick={handleDeleteMessage}>
                        <Typography variant={'body2'}>Delete</Typography>
                    </MenuItem>
                </Stack>
            </Popover>
            <Popover
                open={Boolean(moreEl)}
                anchorEl={moreEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={() => setMoreEl(null)}>
                
                <Stack direction={'column'}>
                    {
                        !contact && (
                            <>
                                <MenuItem
                                    onClick={() => setOpenDialog(true)}>
                                    <Typography variant={'body2'}>Add to contact</Typography>
                                </MenuItem>
                            </>
                        )
                    }
                    <MenuItem
                        disabled={true}>
                        <Typography variant={'body2'}>Media, links, and docs</Typography>
                    </MenuItem>
                    <MenuItem
                        disabled={true}>
                        <Typography variant={'body2'}>Search</Typography>
                    </MenuItem>
                    <MenuItem
                        disabled={true}>
                        <Typography variant={'body2'}>Mute notifications</Typography>
                    </MenuItem>
                </Stack>
            </Popover>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    <Typography variant={'h6'}>Add new contact</Typography>
                </DialogTitle>
                <DialogContent>
                    <OutlinedInput
                        size={'small'}
                        fullWidth
                        sx={{
                            borderRadius: 10
                        }}
                        placeholder={'Name'}
                        value={name}
                        onChange={(event) => setName(event.target.value)} />
                    
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddContact}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
           
        </Box>
    )
}

export { ChatItem };

