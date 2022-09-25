
import {
    AttachFileOutlined, EmojiEmotionsOutlined,
    MoreVertOutlined, NotificationsOutlined, SearchOutlined, SendOutlined
} from '@mui/icons-material'
import {
    Avatar, Box, Card, Grid, IconButton,
    InputAdornment, OutlinedInput, Popover, Stack, Typography
} from '@mui/material'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFirebases } from 'utils'

const Chat = () => {
    const navigate = useNavigate()
    const [anchorMore, setAnchorMore] = useState<null | SVGSVGElement>(null)
    const [openPopup, setOpenPopup] = useState(false)
    const {logout} = useFirebases()

    const handlePopup = (event: React.MouseEvent<SVGSVGElement>) => {
        event.preventDefault()
        setAnchorMore(event.currentTarget)
        setOpenPopup(!openPopup)
    }
    const handleSignOut = () => {
        logout().then((e) => {
            navigate('/')
        })
    }
    return (
        <Grid wrap='nowrap' container={true}>
            <Grid item={true} xs={6}>
                <Stack spacing={2} sx={{ py: 1.3, px: 3, background: '#f3f5f7', }} >
                    <Box sx={{
                        width: '100%', display: 'flex',
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2
                    }}>
                        <Typography variant={'h5'}>Chats</Typography>
                        <Stack direction={'row'}>

                            <IconButton>
                                <NotificationsOutlined style={{ cursor: 'pointer' }} />
                            </IconButton>
                            <IconButton>
                                <MoreVertOutlined onClick={handlePopup} style={{ cursor: 'pointer' }} aria-describedby={'more'} />
                            </IconButton>
                            <Popover
                                id={'more'}
                                anchorEl={anchorMore}
                                onClose={() => setOpenPopup(false)}
                                open={openPopup}>
                                <Stack spacing={2} direction={'column'} sx={{ p: 2 }}>
                                    <Typography variant={'body1'}>Chat Baru</Typography>
                                    <Typography variant={'body1'} onClick={() => handleSignOut()}>Keluar</Typography>
                                </Stack>
                            </Popover>
                        </Stack>
                    </Box>
                    <OutlinedInput
                        fullWidth={true}
                        sx={{ width: '100%', height: 40, borderRadius: 10, background: '#fff', p: 1.5 }}
                        placeholder={'Cari Pesan'}
                        endAdornment={
                            < InputAdornment position={'end'}>
                                <SearchOutlined />
                            </InputAdornment>
                        }
                        size={'small'} />
                </Stack>
            </Grid>
            <Grid item={true} xs={12}>
                <ChatItem />
            </Grid>
        </Grid>
    )
}

const ChatItem = () => {

    const ref = useRef<Element>(null)
    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, height: '100vh', justifyContent: 'space-between' }}>
            <Stack>
                <Card
                    variant={'outlined'}
                    sx={{
                        width: '100%',
                        px: 2,
                        position: 'static',
                        background: '#f3f5f7',
                    }}>
                    <Stack spacing={2} direction={'row'} sx={{ p: 1, position: 'static' }}>
                        <Avatar sx={{ width: 40, height: 40 }} />
                        <Stack spacing={0} direction={'column'}>
                            <Typography variant={'body1'}>John Doe</Typography>
                            <Typography variant={'body2'}>12:00</Typography>
                        </Stack>
                    </Stack>
                </Card>
                pesan
            </Stack>
            <Box
                ref={ref}
                sx={{
                    width: '100%',
                    display: 'static',
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
                        <EmojiEmotionsOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFileOutlined />
                    </IconButton>
                    <OutlinedInput
                        size={'small'}
                        sx={{
                            borderRadius: 20,
                            background: 'white',
                        }}
                        placeholder={'Type a message'}
                        fullWidth={true} />
                    <IconButton>
                        <SendOutlined />
                    </IconButton>
                </Box>
                   
            </Box>
        </Box>
    )
}

export { Chat }
