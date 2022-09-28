import { NotificationsOutlined, MoreVertOutlined, SearchOutlined } from "@mui/icons-material"
import { Grid, Stack, Box, Typography, IconButton, Popover, Modal, OutlinedInput, InputAdornment } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFirebases } from "utils"


const Transaction = () => {
    const navigate = useNavigate()
    const [anchorMore, setAnchorMore] = useState<null | HTMLButtonElement>(null)
    const [openPopup, setOpenPopup] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const {logout} = useFirebases()

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
    return (
        <Grid wrap='nowrap' container={true}>
            <Grid item={true} xs={6}>
                <Stack spacing={2} sx={{position: 'relative', width: '100%'}}>
                    <Stack spacing={2} sx={{py: 1.3, px: 3, background: '#f3f5f7'}}>
                        <Box sx={{
                            width: '100%', display: 'flex',
                            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2
                        }}>
                            <Typography variant={'h5'}>Transactions</Typography>
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
                            onClose={() => setOpenModal(false)}>
                            <Box>
                                Halo
                            </Box>
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
                    {/*<ChatList chats={''}/>*/}
                </Stack>
            </Grid>
            <Grid item={true} xs={12}>
                {/* <ChatItem/> */}
            </Grid>
        </Grid>
    )
}

export {Transaction}