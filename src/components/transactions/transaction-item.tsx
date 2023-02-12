import { Alert, Button, Divider, Modal, OutlinedInput, Paper, Snackbar, Stack, Typography } from "@mui/material"
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { ITransactions } from "interfaces"
import moment from "moment"
import { useState } from "react"
import { db, useFirebases } from "utils"

const TransactionItem = (props: { transaction: ITransactions }) => {

    const {
        transactionName,
        transactionAmount,
        createdAt,
        status,
        transactionType,
        transactionStatus,
        id,
        transactionToken,
        payment_type,
        senderUid
    } = props.transaction


    const [alertDialog, setAlertDialog] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [modalDone, setModalDone] = useState(false)
    const { user } = useFirebases()
    const [reason, setReason] = useState('')

    const openInNewTab = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    const handleDone = (transactionId: string) => {
        const docRef = doc(db, 'transactions', transactionId)
        updateDoc(docRef, {
            status: 'done'
        }).then(() => {
        })
    }

    const handleRefund = () => {
        const docRef = doc(db, 'transactions', id)
        const refundRef = doc(db, 'refunds', id)
        const userRef = query(collection(db, 'users'), where('phoneNumber', '==', user.phoneNumber))
        updateDoc(docRef, {
            status: 'refund',
        }).then(() => {
            setOpenModal(false)
            getDocs(userRef).then((querySnapshot) => {
                if (querySnapshot.empty) {
                    return
                } else {
                    querySnapshot.forEach((docData) => {
                        const ref = doc(db, 'users', docData.id, 'verification', user.phoneNumber)
                        getDoc(ref).then((document) => {
                            if (document.exists()) {
                                const data = document.data()
                                setDoc(refundRef, {
                                    reason: reason,
                                    createdAt: new Date().getTime(),
                                    bankName: data?.bankName,
                                    bankAccount: data?.bankAccount,
                                    bankAccountName: data?.bankAccountName,
                                    orderId: id,
                                }).then(() => {
                                })
                            }
                        })
                    })
                }
            })
        })
    }

    return (
        <Stack
            component={'main'}
            direction={'column'}
            sx={{
                height: 'calc(100vh)'
            }}>

            <Stack
                padding={4}
                direction={'column'}
                alignItems={'center'}>
                <Paper>
                    <Stack
                        px={4}
                        py={2}
                        direction={'column'}>
                        <Stack
                            justifyContent={'space-between'}
                            gap={3}
                            direction={'row'}>
                            <Typography variant={'h6'}>
                                {transactionName}
                            </Typography>
                            <Typography variant={'h6'}>
                                {
                                    Number(transactionAmount).toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR'
                                    })
                                }
                            </Typography>
                        </Stack>
                        <Typography variant={'body2'}>
                            <Typography
                                sx={{
                                    color: status === 'ACTIVE' || status === 'settlement' ? 'green' : 'yellow',
                                    fontWeight: 'bold'
                                }}
                                component={'span'}
                                variant={'body2'}>
                                {status} &nbsp;
                            </Typography>
                            {moment(createdAt).format('DD MMMM YYYY')}
                        </Typography>
                        <Divider />
                        <Stack
                            mt={4}
                            direction={'column'}
                            gap={1}>
                            <Stack
                                gap={10}
                                direction={'row'}
                                justifyContent={'space-between'}>
                                <Typography variant={'body2'}>
                                    Tipe Transaksi
                                </Typography>
                                <Typography variant={'body2'}>
                                    {transactionType}
                                </Typography>
                            </Stack>
                            <Stack
                                gap={10}
                                direction={'row'}
                                justifyContent={'space-between'}>
                                <Typography variant={'body2'}>
                                    Info Transaksi
                                </Typography>
                                <Typography
                                    color={transactionStatus === 'legal' ? 'green' : 'red'}
                                    fontWeight={'bold'}
                                    variant={'body2'}>
                                    {transactionStatus}
                                </Typography>
                            </Stack>
                            <Stack
                                gap={10}
                                direction={'row'}
                                justifyContent={'space-between'}>
                                <Typography variant={'body2'}>
                                    Transaksi ID
                                </Typography>
                                <Typography
                                    sx={{
                                        color: 'grey.500',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            color: 'grey.700'
                                        }
                                    }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(id).then(() => {
                                            setAlertDialog(true)
                                        })
                                    }}
                                    variant={'body2'}>
                                    {String(id).slice(0, 15)}...
                                </Typography>
                            </Stack>
                        </Stack>
                        <Divider />
                        <Stack
                            sx={{
                                mt: 2
                            }}>
                            {
                                status !== 'ACTIVE' && status !== 'settlement' && status !== 'done' && status !== 'refund' ? (
                                    <Stack
                                        direction={'row'}
                                        justifyContent={'space-between'}>
                                        {
                                            transactionToken && senderUid === user?.uid && status !== 'expire' ? (
                                                <Button
                                                    onClick={() => openInNewTab(transactionToken.redirect_url)}
                                                    variant={'contained'}>
                                                    Bayar
                                                </Button>
                                            ) : null
                                        }
                                    </Stack>
                                ) : (
                                    <Stack
                                        direction={'row'}
                                        justifyContent={'space-between'}>
                                        <Typography
                                            variant={'body2'}>
                                            Metode Pembayaran
                                        </Typography>
                                        {
                                            payment_type && (<span>{payment_type}</span>)
                                        }
                                    </Stack>
                                )
                            }
                        </Stack>
                    </Stack>
                </Paper>
                <Paper
                    sx={{
                        mt: 2,
                    }}>
                    {
                        status !== 'done' && status !== 'pending' && status !== 'refund' && (
                            <Stack
                                flexDirection={'row'}
                                gap={2}
                                width={'100%'}
                                justifyContent={'space-between'}>
                                <Button
                                    onClick={() => setModalDone(true)}
                                    variant={'contained'}
                                    color={'primary'}>
                                    Selesai
                                </Button>
                                <Button
                                    onClick={() => setOpenModal(true)}
                                    color={'secondary'}
                                    variant={'outlined'}>
                                    Ajukan Refund
                                </Button>
                            </Stack>
                        )
                    }
                </Paper>
            </Stack>
            <Snackbar
                autoHideDuration={2000}
                onClose={() => setAlertDialog(false)}
                open={alertDialog}>
                <Alert
                    onClose={() => setAlertDialog(false)}
                    severity={'success'}>
                    ID Transaksi berhasil disalin
                </Alert>
            </Snackbar>
            <Modal
                open={openModal}>
                <Stack
                    sx={{
                        width: '50%',
                        backgroundColor: 'white',
                        padding: 4,
                        borderRadius: 1,
                        // center
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}>
                    <Typography variant={'h5'}>
                        Apakah anda yakin ingin mengajukan refund?
                    </Typography>
                    <OutlinedInput
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        sx={{
                            mt: 2
                        }}
                        multiline={true}
                        rows={4}
                        placeholder={'Alasan Refund'} />
                    <Stack
                        marginTop={2}
                        gap={2}
                        width={'100%'}
                        flexDirection={'row-reverse'}>
                        <Button
                            disabled={reason.trim().length <= 2}
                            onClick={handleRefund}
                            variant={'contained'}>
                            Ajukan
                        </Button>
                        <Button
                            onClick={() => setOpenModal(false)}
                            variant={'outlined'}>
                            Batal
                        </Button>
                    </Stack>
                </Stack>
            </Modal>
            <Modal
                open={modalDone}>
                <Stack
                    sx={{
                        width: '50%',
                        backgroundColor: 'white',
                        padding: 4,
                        borderRadius: 1,
                        // center
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}>
                    <Typography variant={'h5'}>
                        Apakah kamu yakin untuk menyelesaikan transaksi ini?
                    </Typography>
                    <Stack
                        marginTop={2}
                        gap={2}
                        width={'100%'}
                        flexDirection={'row-reverse'}>
                        <Button
                            onClick={() => handleDone(id)}
                            variant={'contained'}>
                            Selesai
                        </Button>
                        <Button
                            onClick={() => setModalDone(false)}
                            variant={'outlined'}>
                            Batal
                        </Button>
                    </Stack>
                </Stack>

            </Modal>
        </Stack>
    )
}

export { TransactionItem }

