import { ArrowDropDown, MoreVertOutlined, Phone, Videocam } from "@mui/icons-material";
import {
    Avatar, Box, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, MenuItem, OutlinedInput, Popover, Stack, Typography
} from "@mui/material";
import axios from "axios";
import { TransactionInfo } from "components/transactions/transaction-info";
import { doc, setDoc } from "firebase/firestore";
import { useChats, useContact, useUserStatus } from "hooks";
import { IChatItem, TransactionObject } from "interfaces";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { db, deleteMessage, useFirebases } from "utils";
import { ChatInput } from "./chat-input";

const openNewWindow = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

const ChatItem = (props: { user: IChatItem | null }) => {


    const ref = useRef<HTMLDivElement>(null)
    const { user } = useFirebases()

    const callId = props.user.chatId + new Date().getTime()
    const { messages } = useChats({ id: props.user.chatId, user: user })

    const { status } = useUserStatus({ uid: props.user?.uid })
    const { contact, saveContact } = useContact({ contactId: props.user?.uid, user: user })

    const [moreEl, setMoreEl] = useState<null | HTMLElement>(null)
    const [messageOptionsEl, setMessageOptionsEl] = useState<null | HTMLElement>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [openDialog, setOpenDialog] = useState(false)

    const [name, setName] = useState(props.user?.displayName || '')
    const [transactionDialog, setTransactionDialog] = useState(false)
    const [transaction, setTransaction] = useState<TransactionObject | null>(null)
    const [dialogLoading, setDialogLoading] = useState(false)
    const [dialogMessage, setDialogMessage] = useState(false)


    const handleNewTransaction = () => {
        if (props.user?.isIDCardVerified) {
            setTransactionDialog(!transactionDialog)
        } else {
            setDialogMessage(true)
        }
    }

    const handleCreateTransaction = () => {
        if (transaction) {
            createTransaction(transaction)
        } else {
            setTransactionDialog(false)
        }
    }

    const createTransaction = (transaction: TransactionObject) => {
        setDialogLoading(true)
        const id = transaction.receiverInfo.uid + user?.uid + new Date().getTime()
        const orderId = `order-${new Date().getTime()}`
        const dbRef = doc(db, 'transactions', orderId)
        axios.post(`${import.meta.env.VITE_APP_SERVER_URL}/transactions/new`, {
            customer_details: {
                first_name: transaction.receiverInfo.displayName,
                phone: transaction.receiverInfo.phoneNumber,
                email: transaction.receiverInfo.email
            },
            amount: transaction.transactionAmount + transaction.transactionFee,
            order_id: orderId,
        }, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        }).then((response) => {
            if (response.status === 200) {
                setDoc(dbRef, {
                    id: id,
                    senderPhoneNumber: user?.phoneNumber,
                    senderUid: user?.uid,
                    senderEmail: user?.email ?? "",
                    receiverPhoneNumber: transaction.receiverInfo.phoneNumber,
                    receiverUid: transaction.receiverInfo.uid,
                    receiverEmail: transaction.receiverInfo?.email ?? "",
                    ...transaction,
                    createdAt: new Date().toISOString(),
                    status: "pending",
                    transactionToken: response.data.transactionToken,
                }).then(() => {
                    openNewWindow(response.data.transactionToken.redirect_url)
                    setDialogLoading(false)
                    setTransactionDialog(false)
                    setTransaction(null)
                }).catch((e) => {
                    console.log('error', e)
                    setDialogLoading(false)
                })
            }
        }).catch((error) => {
            console.log('error', error)
            setOpenDialog(false)
        })
    }

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleClickVideoCam = useCallback(() => {
        window.open(`/video-call/${callId}/call/video/${props.user?.uid}`, '_blank', '')
    }, [callId, props.user?.uid])

    const handleClickCall = useCallback(() => {
        window.open(`/video-call/${callId}/call/voice/${props.user?.uid}`, '_blank', '')
    }, [callId, props.user?.uid])

    const handleOpenMore = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMoreEl(event.currentTarget)
    }

    const handleOpenMessageOptionEl = (event: React.MouseEvent<HTMLButtonElement>, id?: string) => {
        if (id) {
            setMessageOptionsEl(event.currentTarget)
            setSelectedId(id)
        } else {
            throw new Error('id is required')
        }
    }

    const handleDeleteMessage = () => {
        deleteMessage({
            id: props.user.chatId, messageId: selectedId, user: user,
            receiver: props.user
        }).then(() => {
        })
        setMessageOptionsEl(null)
    }

    const getContactNameOrPhoneNumber = () => {
        if (contact) {
            return contact.displayName
        } else {
            return props.user?.phoneNumber
        }
    }

    const handleAddContact = () => {
        saveContact({
            displayName: name,
            phoneNumber: props?.user?.phoneNumber,
            uid: props.user?.uid,
            email: props.user.email,
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
                                src={props.user?.photoURL ? props.user?.photoURL : ""}
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
                        width: '0.4em',
                    },
                    '&::-webkit-scrollbar-track': {
                        borderRadius: '20px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#dadada',
                    },
                    flexDirection: 'column-reverse',
                }}>
                <div ref={ref}></div>
                {
                    messages.map((item, index) => {
                        if (item.visibility[user?.uid] === true) {
                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        m: 1,
                                        flexDirection: item.sender.uid === user?.uid ? 'row-reverse' : 'row',
                                    }}>
                                    <Stack spacing={2} direction={'row'} sx={{
                                        p: 1,
                                        boxShadow: 1,
                                        background: item.sender.uid === user?.uid ? '#1a237e' : '#fff',
                                        borderRadius: item.sender.uid === user?.uid ? '10px 10px 0 10px' : '10px 10px 10px 0',
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
                                                                color: item.sender.uid === user?.uid ? '#fff' : '#000'
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
                                                        handleOpenMessageOptionEl(event, item?.id)
                                                    }}
                                                    sx={{
                                                        color: item.sender.uid === user?.uid ? '#fff' : '#000'
                                                    }}>
                                                    <ArrowDropDown />
                                                </IconButton>
                                            </Stack>
                                            <Typography
                                                sx={{
                                                    color: item.sender.uid === user?.uid ? '#fff' : '#000'
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
                    <MenuItem
                        onClick={handleNewTransaction}>
                        <Typography variant={'body2'}>Buat Transaksi</Typography>
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

            <Dialog
                open={transactionDialog}
                onClose={() => setTransactionDialog(false)}>
                <DialogTitle>
                    <Typography variant={'h6'}>Buat Transaksi</Typography>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <TransactionInfo
                            contact={{
                                displayName: props?.user?.displayName,
                                phoneNumber: props?.user?.phoneNumber,
                                uid: props.user?.uid
                            }}
                            onClick={(transactions?: TransactionObject) => {
                                if (transactions) {
                                    setTransaction(transactions)
                                } else {
                                    setTransaction(null)
                                }
                            }} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant={'outlined'}
                        onClick={() => setTransactionDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateTransaction}
                        disabled={!transaction}
                        variant="contained">
                        Buat Transaksi
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={dialogLoading}>
                <DialogContent>
                    <Stack
                        direction={'column'}
                        spacing={2}
                        alignItems={'center'}
                        justifyContent={'center'}>
                        <CircularProgress />
                    </Stack>
                </DialogContent>
            </Dialog>
            <Dialog
                onClose={() => setDialogMessage(false)}
                open={dialogMessage}>
                <DialogTitle>
                    <Typography variant={'h6'}>Akun ini belum terverifikasi!</Typography>
                </DialogTitle>

                <DialogContent>
                    <Stack
                        direction={'column'}
                        spacing={2}>
                        Transaksi hanya bisa dilakukan apa bila akun yang dituju sudah terverifikasi.
                    </Stack>
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export { ChatItem };

