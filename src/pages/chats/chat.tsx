import { MoreVertOutlined, NotificationsOutlined, SearchOutlined } from '@mui/icons-material'
import {
    Box,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Modal,
    OutlinedInput,
    Popover,
    Stack,
    Typography
} from '@mui/material'
import { doc, getDoc } from 'firebase/firestore'
import { useChats } from 'hooks'
import { IChatItem } from 'interfaces'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, useFirebases } from 'utils'
import { ChatItem } from "./chat-item"
import { ChatList } from './chat-list'


const Chat = () => {


    const navigate = useNavigate()
    const {logout} = useFirebases()
    const [anchorMore, setAnchorMore] = useState<null | HTMLButtonElement>(null)
    const [openPopup, setOpenPopup] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [query, setQuery] = useState('')
    const [error, setError] = useState(false)
    const [users, setUsers] = useState<IChatItem | null>(null)

    const {user} = useFirebases()


    const {chatList} = useChats({user: user})

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
                setUsers(docSnap.data() as IChatItem)
            }
        })
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
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left'
                                    }}
                                    open={openPopup}>
                                    <Stack direction={'column'}>
                                        <MenuItem
                                            onClick={() => handleOpenModal()}>
                                            <Typography
                                                variant={'body2'}
                                                sx={{cursor: 'pointer'}}>
                                                Chat Baru
                                            </Typography>
                                        </MenuItem>
                                        <MenuItem onClick={handleSignOut}>
                                            <Typography
                                                variant={'body2'}
                                                onClick={() => handleSignOut()}
                                                sx={{cursor: 'pointer'}}>
                                                Keluar
                                            </Typography>
                                        </MenuItem>
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
                                    sx={{borderRadius: 10}}/>
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
                    users && <ChatItem user={users}/>
                }
            </Grid>
        </Grid>
    )
}

export { Chat }

