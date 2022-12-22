import { MoreVertOutlined, NotificationsOutlined, SearchOutlined } from "@mui/icons-material"
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, InputAdornment,
    MenuItem, OutlinedInput, Popover, Stack,
    Typography
} from "@mui/material"
import { Contacts, TransactionItem, TransactionList } from "components"
import { useTransactions } from "hooks"
import { ITransactions } from "interfaces"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFirebases } from "utils"


const Transaction = () => {
    const navigate = useNavigate()
    const { logout, user } = useFirebases()

    const [anchorMore, setAnchorMore] = useState<null | HTMLButtonElement>(null)
    const [openPopup, setOpenPopup] = useState(false)
    const [alertDialog, setAlertDialog] = useState(false)
    const [openContacts, setOpenContacts] = useState(false)
    const [transaction, setTransaction] = useState<ITransactions | null>(null)


    const { transactions } = useTransactions({
        userId: user.uid
    })



    const handlePopup = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setAnchorMore(event.currentTarget)
        setOpenPopup(!openPopup)
    }

    const handleOpenModalContacts = useCallback(() => {
        if (user && user.isIDCardVerified) {
            setOpenContacts(!openContacts)
        } else {
            setAlertDialog(true)
        }
    }, [openContacts, user])

    const handleSignOut = () => {
        logout().then((_) => {
            navigate('/')
        })
    }

    const handleCloseAlertDialog = () => {
        setAlertDialog(false)
        setOpenPopup(false)
    }

    const navigateToVerify = useCallback(() => {
        navigate('/account/verify')
    }, [navigate])
    return (
        <Grid
            wrap='nowrap'
            container={true}>
            <Grid
                item={true}
                xs={6}>
                <Stack
                    spacing={2}
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: 'calc(100vh)',
                    }}>
                    <Stack
                        spacing={2}
                        sx={{
                            py: 1.3,
                            px: 3,
                            background: '#f3f5f7',
                            display: 'flex'
                        }}>
                        <Box
                            sx={{
                                width: '100%', display: 'flex',
                                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2
                            }}>
                            <Typography
                                variant={'h5'}>Transactions</Typography>
                            <Stack
                                direction={'row'}>

                                <IconButton>
                                    <NotificationsOutlined
                                        style={{ cursor: 'pointer' }} />
                                </IconButton>
                                <IconButton
                                    onClick={handlePopup}>
                                    <MoreVertOutlined
                                        style={{ cursor: 'pointer' }}
                                        aria-describedby={'more'} />
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
                                            <Typography
                                                variant={'body2'}>Transaksi Baru</Typography>
                                        </MenuItem>
                                        <MenuItem>
                                            <Typography
                                                variant={'body2'}>Pengaturan</Typography>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={handleSignOut}>
                                            <Typography variant={'body2'}>Keluar</Typography>
                                        </MenuItem>
                                        <Contacts
                                            open={openContacts}
                                            onDone={(_status: boolean) => {
                                                setOpenContacts(false)
                                            }}
                                            onClose={() => setOpenContacts(!openContacts)} />
                                    </Stack>
                                </Popover>
                            </Stack>
                        </Box>
                        <OutlinedInput
                            fullWidth={true}
                            sx={{ width: '100%', height: 40, borderRadius: 10, background: '#fff', p: 1.5 }}
                            placeholder={'Cari Transaksi'}
                            endAdornment={
                                < InputAdornment position={'end'}>
                                    <SearchOutlined />
                                </InputAdornment>
                            }
                            size={'small'} />
                    </Stack>
                    <Stack
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            flex: 1,
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': {
                                width: '0.4em'
                            },
                            '&::-webkit-scrollbar-track': {
                                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                                webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(0,0,0,.1)',
                            }
                        }}>
                        <TransactionList
                            transactions={transactions}
                            onSelect={(e) => setTransaction(e)} />
                    </Stack>
                </Stack>
                <Dialog
                    onClose={handleCloseAlertDialog}
                    open={alertDialog}>
                    <DialogTitle>
                        <Typography
                            variant={'body1'}>
                            Anda belum melakukan verifikasi identitas
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Typography
                            variant={'body2'}>
                            Silahkan verifikasi identitas anda terlebih dahulu untuk melakukan transaksi
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseAlertDialog}>
                            Nanti Saja
                        </Button>
                        <Button
                            variant={"contained"}
                            onClick={navigateToVerify}>
                            Verifikasi Sekarang
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
            <Grid
                item={true} xs={12}>
                {
                    transaction && <TransactionItem transaction={transaction} />
                }
            </Grid>

        </Grid>
    )
}

export { Transaction }
