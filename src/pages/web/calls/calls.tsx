import { MoreVertOutlined, NotificationsOutlined, SearchOutlined } from "@mui/icons-material"
import { Box, Grid, IconButton, InputAdornment, Modal, OutlinedInput, Popover, Stack, Typography } from "@mui/material"
import { useVideoCall } from "hooks"
import { ICall } from "interfaces"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFirebases } from "utils"
import { CallDetail } from "./call-detail"
import { CallList } from "./call-list"


const Calls = () => {
    const navigate = useNavigate()
    const [anchorMore, setAnchorMore] = useState<null | HTMLButtonElement>(null)
    const [openPopup, setOpenPopup] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [call, setCall] = useState<ICall | null>(null)
    const [innerCalls, setInnerCalls] = useState<ICall[]>([])
    const [search, setSearch] = useState('')
    
    const { logout, user } = useFirebases()


    const { calls } = useVideoCall({ user })


    const handleGetCall = (callId: string) => {
        setCall(calls.find((call) => call.callId === callId))
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
    return (
        <Grid wrap='nowrap' container={true}>
            <Grid item={true} xs={6}>
                <Stack
                    spacing={2}
                    component={'section'}
                    sx={{
                        display: 'flex',
                        height: 'calc(100vh)',
                        flexFlow: 'column wrap',
                        position: 'relative', width: '100%'
                    }}>
                    <Stack
                        component={'header'}
                        spacing={2}
                        sx={{
                        py: 1.3, px: 3, background: '#f3f5f7',
                        display: 'flex'
                    }}>
                        <Box sx={{
                            width: '100%', display: 'flex',
                            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2
                        }}>
                            <Typography variant={'h5'}>Calls</Typography>
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
                                    onClose={() => setOpenPopup(false)}
                                    open={openPopup}>
                                    <Stack spacing={2} direction={'column'} sx={{ p: 2 }}>
                                        <Typography
                                            variant={'body1'}
                                            onClick={() => handleOpenModal()}
                                            sx={{ cursor: 'pointer' }}>Panggilan Baru</Typography>
                                        <Typography
                                            variant={'body1'}
                                            onClick={() => handleSignOut()}
                                            sx={{ cursor: 'pointer' }}>Keluar</Typography>
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
                            value={search}
                            onChange={(e) => {setSearch(e.target.value)}}
                            fullWidth={true}
                            sx={{ width: '100%', height: 40, borderRadius: 10, background: '#fff', p: 1.5 }}
                            placeholder={'Cari Pengilan'}
                            endAdornment={
                                < InputAdornment position={'end'}>
                                    <SearchOutlined />
                                </InputAdornment>
                            }
                            size={'small'} />
                    </Stack>
                    <CallList calls={calls} filterOptions={search} onClick={handleGetCall} innerCalls={(calls) => setInnerCalls(calls)} />
                </Stack>
            </Grid>
            <Grid item={true} xs={12}>
                {
                    call !== null && <CallDetail call={call} innerCalls={innerCalls} />
                }
            </Grid>
        </Grid>
    )
}

export { Calls }
