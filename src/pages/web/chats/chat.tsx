import { Call, CallEndOutlined, MoreVertOutlined, NotificationsOutlined, SearchOutlined } from '@mui/icons-material'
import {
    Avatar,
    Box, Drawer, Grid, IconButton, InputAdornment,
    Modal, OutlinedInput, Popover, Stack, Typography
} from '@mui/material'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useAppDispatch, useAppSelector, useChats, useVideoCall } from 'hooks'
import { IChatItem } from 'interfaces'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setChatItem } from 'redux/openMessageReducer'
import { db, useFirebases } from 'utils'
import { ChatItem } from "./chat-item"
import { ChatList } from './chat-list'



const Chat = () => {
    
    const chatItem = useAppSelector(state => state.openMessage.chaItem)
    const dispatch = useAppDispatch()
    
    const navigate = useNavigate()
    const { logout } = useFirebases()
    const [anchorMore, setAnchorMore] = useState<null | HTMLButtonElement>(null)
    const [openPopup, setOpenPopup] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [query, setQuery] = useState('')
    const [error, setError] = useState(false)
    const [users, setUsers] = useState(chatItem)
    const [drawerCall, setDrawerCall] = useState(true)

    const { user } = useFirebases()
    
    const { chatList } = useChats({ user: user })
    const { call } = useVideoCall({ user: user })

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    }
    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const dbRef = doc(db, 'users', query)
            getDoc(dbRef).then(docSnap => {
                if (docSnap.exists()) {
                    setUsers(docSnap.data() as IChatItem)
                    setOpenModal(false)
                    setError(false)
                } else {
                    setError(true)
                }
            })
        }
    }
    const handleOpenModal = () => {
        setOpenPopup(false)
        setOpenModal(true)

    }
    const handlePopup = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setAnchorMore(event.currentTarget)
        setOpenPopup(!openPopup)
    }
    const handleSignOut = () => {
        logout().then((_) => {
            navigate('/')
        })
    }

    const onChatClick = (event: string) => {
        const dbRef = doc(db, 'users', event)
        getDoc(dbRef).then(docSnap => {
            if (docSnap.exists()) {
                dispatch(setChatItem(docSnap.data() as IChatItem))
                setUsers(docSnap.data() as IChatItem)
            }
        })
    }

    const handleOnCallReject = () => {
        const dbRef = doc(db, 'calls', call.callId)
        updateDoc(dbRef, {
            status: 'rejected'
        }).then(() => {
            setDrawerCall(false)
        })
    }

    const handleOnCallAccept = () => {
        navigate(`/video-call/${call.callId}/answer`)
    }
    

    return (
        <Grid wrap='nowrap' container={true}>
            <Grid item={true} xs={6}>
                <Stack sx={{position: 'relative', width: '100%'}} spacing={1}>
                    <Stack spacing={2} sx={{py: 1.3, px: 3, background: '#f3f5f7'}}>
                        <Box sx={{
                            width: '100%', display: 'flex',
                            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2
                        }}>
                            <Typography variant={'h5'}>Chats</Typography>
                            <Stack direction={'row'}>

                                <IconButton>
                                    <NotificationsOutlined style={{cursor: 'pointer'}}/>
                                </IconButton>
                                <IconButton onClick={handlePopup}>
                                    <MoreVertOutlined style={{cursor: 'pointer'}} aria-describedby={'more'}/>
                                </IconButton>
                                <Popover
                                    id={'more'}
                                    anchorEl={anchorMore}
                                    onClose={() => setOpenPopup(false)}
                                    open={openPopup}>
                                    <Stack spacing={2} direction={'column'} sx={{p: 2}}>
                                        <Typography
                                            variant={'body1'}
                                            onClick={() => handleOpenModal()}
                                            sx={{cursor: 'pointer'}}>Chat Baru</Typography>
                                        <Typography
                                            variant={'body1'}
                                            onClick={() => handleSignOut()}
                                            sx={{cursor: 'pointer'}}>Keluar</Typography>
                                    </Stack>
                                </Popover>
                            </Stack>
                        </Box>
                        <Modal
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                            aria-labelledby={"modal-modal-title"}
                            aria-describedby={"modal-modal-description"}>
                            <Stack
                                spacing={2}
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
                                <Typography id={"modal-modal-title"} variant="h6" component="h2">
                                    Cari Nomor Telepon
                                </Typography>

                                <OutlinedInput
                                    size={'small'}
                                    id={'modal-modal-description'}
                                    fullWidth={true}
                                    error={error}
                                    value={query}
                                    onChange={handleSearch}
                                    onKeyDown={handleEnter}
                                    placeholder={'Cari Nomor Telepon'}
                                    sx={{ borderRadius: 10 }} />
                            </Stack>
                        </Modal>
                        <OutlinedInput
                            fullWidth={true}
                            sx={{width: '100%', height: 40, borderRadius: 10, background: '#fff', p: 1.5}}
                            placeholder={'Cari Pesan'}
                            endAdornment={
                                < InputAdornment position={'end'}>
                                    <SearchOutlined/>
                                </InputAdornment>
                            }
                            size={'small'}/>
                    </Stack>
                    <ChatList
                        onClick={onChatClick}
                        chat={chatList}/>
                </Stack>
            </Grid>
            <Grid item={true} xs={12}>
                {
                    users !== undefined && <ChatItem user={users}/>
                }
            </Grid>
            {
                call !== null && (
                    <Drawer
                        anchor={'bottom'}
                        open={drawerCall}>
                        <Stack
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                p: 5,
                            }}
                            spacing={2}>
                            <Avatar
                                sx={{ width: 100, height: 100, mx: 'auto' }}
                                src={call?.photoURL} />
                            <Typography variant={'h5'}>{call?.displayName}</Typography>
                            <Typography variant={'body1'}>{call?.phoneNumber}</Typography>
                            <Stack direction={'row'} spacing={2} sx={{ mx: 'auto' }}>
                                <IconButton
                                    onClick={handleOnCallReject}>
                                    <CallEndOutlined
                                        color={'error'} />
                                </IconButton>
                                <IconButton
                                    onClick={handleOnCallAccept}>
                                    <Call
                                        color={'info'} />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Drawer>
                )
            }
        </Grid>
    )
}

export { Chat }

