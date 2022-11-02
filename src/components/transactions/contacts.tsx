import { AddOutlined } from "@mui/icons-material"
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Modal, Stack, Typography } from "@mui/material"
import axios from "axios"
import { doc, setDoc } from "firebase/firestore"
import { useContacts } from "hooks"
import { IContact, TransactionObject } from "interfaces"
import moment from "moment"
import { useState } from "react"
import { db, useFirebases } from "utils"
import { ContactList } from "./contact-list"
import { TransactionInfo } from "./transaction-info"

interface IContactsProps {
    open: boolean,
    onClose: () => void,
    onDone?: (success: boolean) => void
}

// TODO: add new modal for new contact

const Contacts: React.FC<IContactsProps> = (props) => {
    const { open = false, onClose, onDone } = props

    const { user } = useFirebases()
    const { contacts } = useContacts({
        user: user
    })

    const [selectedUser, setSelectedUser] = useState<IContact | null>(null)
    const [indexView, setIndexView] = useState(1)
    const [transaction, setTransaction] = useState<TransactionObject | null>(null)
    const [openDialog, setOpenDialog] = useState(false)

    const handleOnContactClick = (contact: IContact) => {
        setSelectedUser(contact)
        setIndexView(indexView + 1)
    }

    const handleClick = () => {
        if (transaction == null) {
            setIndexView(indexView + 1)
        } else {
            createTransaction(transaction)
        }
    }

    const handleDialogClose = () => {
        setOpenDialog(false)
    }

    const createTransaction = (transaction: TransactionObject) => {
        setOpenDialog(true)
        const id = transaction.receiverInfo.uid + user?.uid
        const dbRef = doc(db, 'transactions', id)
        console.log(transaction)
        axios.post(`${process.env.REACT_APP_BIGFLIP_SANBOX_URL}/pwf/bill`, {
            "amount": Number(transaction.transactionAmount) + transaction.transactionFee,
            "title": transaction.transactionName,
            "expire_date": `${moment(new Date().getTime() + 86400000).format('YYYY-MM-DD HH:mm')}`,
            "type": "SINGLE",
            "is_address_required": 0,
            "is_phone_required": 0,
            "redirect_url": "https://bigflip.id"
        }, {
            headers: {
                "Content-Type": "application/json",
            },
            auth: {
                username: `${process.env.REACT_APP_BIGFLIP_SECRET_KEY}`,
                password: ''
            }
        }).then((response) => {
            setDoc(dbRef, {
                id: id,
                senderPhoneNumber: user?.phoneNumber,
                senderUid: user?.uid,
                receiverPhoneNumber: transaction.receiverInfo.phoneNumber,
                receiverUid: transaction.receiverInfo.uid,
                ...transaction,
                createdAt: new Date().toISOString(),
                status: response.data.status,
            }).then(() => {
                setOpenDialog(false)
                onDone && onDone(true)
            }).catch(() => {
                setOpenDialog(false)
                onDone && onDone(false)
            })
        }).catch(() => {
            setOpenDialog(false)
            onDone && onDone(false)
        })
    }
    return (
        <Modal
            aria-labelledby={"modal-modal-title"}
            aria-describedby={"modal-modal-description"}
            onClose={onClose}
            open={open}>
            <Stack
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60%',
                    bgcolor: 'background.paper',
                    p: 3,
                    borderRadius: 2,
                    height: '80%'
                }}
                direction={'column'}
                spacing={2}>
                <Dialog
                    open={openDialog}
                    onClose={handleDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Sedang memproses transaksi"}
                    </DialogTitle>
                    <DialogContent>
                        <CircularProgress />
                    </DialogContent>

                </Dialog>
                <Stack
                    sx={{
                        display: 'flex',
                    }}
                    direction={'row'}
                    justifyContent={'space-between'}>
                    <Typography variant={'h5'}>{
                        indexView === 1 ? "Pilih Kontak" : "Lengkapi Informasi"
                    }</Typography>
                    <IconButton>
                        <AddOutlined />
                    </IconButton>
                </Stack>
                <Stack
                    direction={'column'}
                    sx={{
                        overflowY: 'auto',
                        height: '100%',
                        display: 'flex',
                        flex: 1
                    }}>
                    {
                        indexView === 1 && (
                            contacts?.map((contact, index) => {

                                return (
                                    <ContactList
                                        key={index}
                                        contact={contact}
                                        onClick={handleOnContactClick} />
                                )
                            })
                        )
                    }
                    {
                        indexView === 2 && (
                            <TransactionInfo
                                onClick={(value) => {
                                    if (value) {
                                        setTransaction(value)
                                    } else {
                                        setTransaction(null)
                                    }
                                }}
                                contact={selectedUser} />
                        )
                    }
                </Stack>
                <Stack
                    spacing={2}
                    direction={'row-reverse'}>
                    <Button
                        disabled={!selectedUser || transaction === null}
                        onClick={handleClick}
                        variant={'contained'}>
                        Next
                    </Button>
                    {
                        indexView > 1 ? (
                            <Button
                                onClick={() => setIndexView(indexView - 1)}
                                variant={'contained'}>
                                Back
                            </Button>
                        ) : null
                    }
                </Stack>
            </Stack>
        </Modal>
    )
}

export { Contacts }

