import { MoreVertOutlined, NotificationsOutlined, SearchOutlined } from "@mui/icons-material"
import {
    Box, Grid, IconButton, InputAdornment,
    MenuItem, OutlinedInput, Popover, Stack,
    Typography
} from "@mui/material"
import { Contacts } from "components"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFirebases } from "utils"


const Transaction = () => {
    const navigate = useNavigate()
    const { logout } = useFirebases()

    const [anchorMore, setAnchorMore] = useState<null | HTMLButtonElement>(null)
    const [openPopup, setOpenPopup] = useState(false)
    const [openContacts, setOpenContacts] = useState(false)


    const handlePopup = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setAnchorMore(event.currentTarget)
        setOpenPopup(!openPopup)
    }

    const handleOpenModalContacts = () => {
        setOpenContacts(!openContacts)
    }

    const handleSignOut = () => {
        logout().then((_) => {
            navigate('/')
        })
    }
    return (
        <Grid wrap='nowrap' container={true}>
            <Grid item={true} xs={6}>
                <Stack spacing={2} sx={{ position: 'relative', width: '100%' }}>
                    <Stack spacing={2} sx={{ py: 1.3, px: 3, background: '#f3f5f7' }}>
                        <Box sx={{
                            width: '100%', display: 'flex',
                            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2
                        }}>
                            <Typography variant={'h5'}>Transactions</Typography>
                            <Stack direction={'row'}>

                                <IconButton>
                                    <NotificationsOutlined style={{ cursor: 'pointer' }} />
                                </IconButton>
                                <IconButton onClick={handlePopup}>
                                    <MoreVertOutlined style={{ cursor: 'pointer' }} aria-describedby={'more'} />
                                </IconButton>
                                <Popover
                                    id={'more'}
                                    anchorEl={anchorMore}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left'
                                    }}
                                    onClose={() => setOpenPopup(false)}
                                    open={openPopup}>
                                    <Stack direction={'column'}>
                                        <MenuItem
                                            onClick={handleOpenModalContacts}>
                                            <Typography variant={'body2'}>Transaksi Baru</Typography>
                                        </MenuItem>
                                        <MenuItem>
                                            <Typography variant={'body2'}>Pengaturan</Typography>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={handleSignOut}>
                                            <Typography variant={'body2'}>Keluar</Typography>
                                        </MenuItem>
                                        <Contacts
                                            open={openContacts}
                                            onClose={() => setOpenContacts(!openContacts)} />
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
                    {/*<ChatList chats={''}/>*/}
                </Stack>
            </Grid>
            <Grid item={true} xs={12}>
                {/* <ChatItem/> */}
            </Grid>

        </Grid>
    )
}

export { Transaction }
