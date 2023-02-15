import { Box, Button, Card, Chip, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { ITransactions } from "interfaces";
import moment from "moment";
import { useEffect, useState } from "react";
import { db } from "utils";
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}


interface RefundData {
    id: string,
    bankAccount: string,
    bankName: string,
    bankAccountName: string,
    orderId: string,
    reason: string,
    createdAt: string,
}

interface VerificationAccount extends Omit<RefundData, 'id' | 'orderId' | 'reason' | 'createdAt'> {
    nik: string,
    image: string,
    name: string,
    dob: string,
    address: string,
    phoneNumber: string,
}

interface UTransaction extends ITransactions {
    uid: string
}

const Admin = () => {

    const [value, setValue] = useState(0)
    const [expanded, setExpanded] = useState(false)
    const [transaction, setTransaction] = useState<UTransaction[]>([])
    const [transactionRefund, setTransactionRefund] = useState<RefundData[]>([])
    const [transactionVerif, setTransactionVerif] = useState<VerificationAccount[]>([])
    const [alertDialog, setAlertDialog] = useState(false)
    const [dialogRefund, setDialogRefund] = useState(false)
    const [refundId, setRefundId] = useState(null)
    const [selectedPhone, setSelectedPhone] = useState(null)

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    useEffect(() => {
        const dbRef = query(collection(db, 'transactions'), where('status', '==', 'done'))
        const dbRefRefund = query(collection(db, 'refunds'), where('status', '==', false))
        const userRef = query(collection(db, 'users'), where('isIDCardVerified', '==', false))
        getDocs(dbRef).then((querySnapshot) => {
            const data: UTransaction[] = []
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), uid: doc.id } as UTransaction)
            })
            setTransaction(data)
        })
        getDocs(dbRefRefund).then((querySnapshot) => {
            const data: RefundData[] = []
            querySnapshot.forEach((doc) => {
                data.push(doc.data() as RefundData)
            })
            setTransactionRefund(data)
        })
        getDocs(userRef).then((querySnapshot) => {

            querySnapshot.forEach((docs) => {
                const ref = collection(db, 'users', docs.id, 'verification')
                const verifData: VerificationAccount[] = []
                getDocs(ref).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const data = doc.data() as VerificationAccount
                        verifData.push({ ...data, phoneNumber: docs.data().phoneNumber })
                    })
                })
                setTransactionVerif(verifData)
            })
        })
    }, [])


    const handleAcceptRefund = () => {
        if (refundId) {
            const dbRef = doc(db, 'refunds', refundId)
            const trasactionDbRef = doc(db, 'transactions', refundId)
            updateDoc(dbRef, {
                status: true
            }).then(() => {
                console.log('berhasil')
                updateDoc(trasactionDbRef, {
                    status: 'finish'
                }).then(() => {
                    setDialogRefund(false)
                })
            })
        } else {
            alert('ad kesalahan silahkan coba lagi')
        }
    }

    const handleConfirmVerification = () => {
        if (selectedPhone) {
            const userRef = query(collection(db, 'users'), where('phoneNumber', '==', selectedPhone))
            getDocs(userRef).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const ref = doc.ref
                    updateDoc(ref, {
                        isIDCardVerified: true
                    }).then(() => {
                        setAlertDialog(false)
                    })
                })
            })
        }
    }

    return (
        <Stack
            sx={{
                padding: 3,
            }}>
            {/* <Typography variant={'h5'}>Akses admin rekberin</Typography> */}
            <Tabs
                variant={'fullWidth'}
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example">
                <Tab label="Transaksi Sukses" />
                <Tab label="Transaksi Refund" />
                <Tab label="Verifikasi Akun" />
            </Tabs>
            <TabPanel
                value={value}
                index={0}>
                <Stack
                    gap={2}>
                    {
                        transaction.map((item, index) => {
                            return (
                                <Paper
                                    sx={{
                                        padding: 2,
                                    }}
                                    onClick={() => setExpanded(!expanded)}
                                    key={index}>
                                    <Stack
                                        gap={1}>
                                        <Typography variant={'h5'}>{item.transactionName}</Typography>
                                        <Stack
                                            gap={2}
                                            direction={'row'}>
                                            <Chip label={item.status} />
                                            <Chip label={item.transactionType} />
                                            <Chip label={item.payment_type} />
                                        </Stack>
                                        <Typography>
                                            {moment(item.createdAt).format('DD MMMM YYYY')}
                                        </Typography>
                                        <Detail item={item} />
                                    </Stack>
                                </Paper>
                            )
                        })

                    }
                </Stack>
            </TabPanel>
            <TabPanel
                value={value}
                index={1}>
                <Stack
                    gap={2}>
                    {
                        transactionRefund.map((item) => {
                            return (
                                <Paper
                                    sx={{
                                        padding: 2,
                                    }}
                                    onClick={() => setExpanded(!expanded)}
                                    key={item.orderId}>
                                    <Stack
                                        gap={1}>
                                        <Typography variant={'h5'}>Permintaan Refund</Typography>
                                        <Typography>
                                            {item.reason}
                                        </Typography>
                                        <Stack
                                            gap={2}
                                            direction={'row'}>
                                            <Chip label={item.orderId} />
                                        </Stack>
                                        <Stack>
                                            <Card
                                                sx={{
                                                    padding: 2,
                                                }}
                                                variant={'outlined'}>
                                                <Typography variant={'h6'}>
                                                    Detail Bank Pengguna
                                                </Typography>
                                                <Stack
                                                    direction={'row'}
                                                    gap={2}>
                                                    Atas Nama Bank:
                                                    <Typography>
                                                        {item?.bankAccountName}
                                                    </Typography>
                                                </Stack>
                                                <Stack
                                                    direction={'row'}
                                                    gap={2}>
                                                    Nama Bank:
                                                    <Typography>
                                                        {item?.bankName}
                                                    </Typography>
                                                </Stack>
                                                <Stack
                                                    direction={'row'}
                                                    gap={2}>
                                                    Nomor Rekening:
                                                    <Typography>
                                                        {item?.bankAccount}
                                                    </Typography>
                                                </Stack>
                                            </Card>
                                        </Stack>
                                        <Stack
                                            gap={2}
                                            alignItems={'center'}
                                            direction={'row'}>
                                            <Typography>
                                                {moment(item.createdAt).format('DD MMMM YYYY')}
                                            </Typography>
                                            <Button
                                                onClick={() => {
                                                    setRefundId(item.orderId)
                                                    setDialogRefund(true)
                                                }}
                                                variant={'contained'}>
                                                Terima
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            )
                        })
                    }
                </Stack>
            </TabPanel>
            <TabPanel
                value={value}
                index={2}>
                <Stack
                    gap={2}>
                    {
                        transactionVerif.map((item) => {
                            return (
                                <Paper
                                    key={item.nik}>
                                    <Stack
                                        direction={'row'}
                                        gap={2}
                                        p={2}>
                                        <a
                                            style={{
                                                height: '100%'

                                            }}
                                            href={item.image}>
                                            <Card
                                                alt={'ktp'}
                                                component={'img'}
                                                src={item.image}
                                                width={400}
                                                sx={{
                                                    objectFit: 'cover'
                                                }}
                                                height={'auto'} />
                                        </a>
                                        <Stack
                                            flex={1}
                                            gap={2}>
                                            <Card
                                                sx={{
                                                    padding: 2,
                                                }}
                                                variant={'outlined'}>
                                                <Typography variant={'h6'}>
                                                    Detail Pengguna
                                                </Typography>
                                                <Stack
                                                    direction={'row'}
                                                    gap={2}>
                                                    Nama:
                                                    <Typography>
                                                        {item.name}
                                                    </Typography>
                                                </Stack>
                                                <Stack
                                                    direction={'row'}
                                                    gap={2}>
                                                    Nomor HP:
                                                    <Typography>
                                                        {item.phoneNumber}
                                                    </Typography>
                                                </Stack>
                                                <Stack
                                                    direction={'row'}
                                                    gap={2}>
                                                    Tanggal Lahir:
                                                    <Typography>
                                                        {item.dob}
                                                    </Typography>
                                                </Stack>
                                                <Stack
                                                    direction={'row'}
                                                    gap={2}>
                                                    Alamat:
                                                    <Typography>
                                                        {item.address}
                                                    </Typography>
                                                </Stack>
                                                <Stack
                                                    direction={'row'}
                                                    gap={2}>
                                                    NIK:
                                                    <Typography>
                                                        {item.nik}
                                                    </Typography>
                                                </Stack>

                                            </Card>
                                            <Card
                                                sx={{
                                                    padding: 2,
                                                }}
                                                variant={'outlined'}>
                                                <Typography variant={'h6'}>
                                                    Detail Bank
                                                </Typography>
                                                <Stack
                                                    direction={'row'}
                                                    gap={2}>
                                                    Nama Bank:
                                                    <Typography>
                                                        {item.bankName}
                                                    </Typography>
                                                </Stack>
                                                <Stack
                                                    direction={'row'}
                                                    gap={2}>
                                                    Atas Nama Bank:
                                                    <Typography>
                                                        {item.bankAccountName}
                                                    </Typography>
                                                </Stack>
                                                <Stack
                                                    direction={'row'}
                                                    gap={2}>
                                                    Nomor Rekening:
                                                    <Typography>
                                                        {item.bankAccount}
                                                    </Typography>
                                                </Stack>
                                            </Card>
                                        </Stack>

                                    </Stack>
                                    <Stack>
                                        <Button
                                            onClick={() => {
                                                setSelectedPhone(item.phoneNumber)
                                                setAlertDialog(true)
                                            }}
                                            variant={'contained'}>
                                            Terima Verifikasi
                                        </Button>
                                    </Stack>
                                </Paper>
                            )
                        })
                    }
                </Stack>
            </TabPanel>
            <Dialog
                onClose={() => setAlertDialog(false)}
                open={alertDialog}>
                <DialogTitle>
                    <Typography
                        variant={'body1'}>
                        Konfirmasi
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography
                        variant={'body2'}>
                        Apakah kamu yakin untuk menerima akun pengguna ini
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setAlertDialog(false)}>
                        Batalkan
                    </Button>
                    <Button
                        variant={"contained"}
                        onClick={handleConfirmVerification}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                onClose={() => setDialogRefund(false)}
                open={dialogRefund}>
                <DialogTitle>
                    <Typography
                        variant={'body1'}>
                        Konfirmasi
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography
                        variant={'body2'}>
                        Apakah kamu yakin untuk menerima Refund dari transaksi ini
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDialogRefund(false)}>
                        Batalkan
                    </Button>
                    <Button
                        variant={"contained"}
                        onClick={handleAcceptRefund}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}

type BankInfo = Omit<RefundData, 'id' | 'reason' | 'createdAt'>

const Detail = (props: { item: UTransaction }) => {

    const [expanded, setExpanded] = useState(false)
    const [bankInfo, setBankInfo] = useState<BankInfo | null>(null)
    const [senderBankInfo, setSenderBankInfo] = useState<BankInfo | null>(null)

    const [dialog, setDialog] = useState(false)

    const { item } = props

    useEffect(() => {
        if (item.receiverInfo.phoneNumber) {
            const dbRef = query(collection(db, 'users'), where('phoneNumber', '==', item.receiverInfo.phoneNumber))
            getDocs(dbRef).then((querySnapshot) => {
                if (querySnapshot.empty) {
                    setBankInfo(null)
                } else {
                    querySnapshot.forEach((docs) => {
                        const ref = doc(db, 'users', docs.id, 'verification', item.receiverInfo.phoneNumber)
                        getDoc(ref).then((doc) => {
                            if (doc.exists()) {
                                const data = doc.data() as BankInfo
                                setBankInfo(data)
                            } else {
                                setBankInfo(null)
                            }
                        })
                    })
                }
            })
        }
        if (item.senderPhoneNumber) {
            const dbRef = query(collection(db, 'users'), where('phoneNumber', '==', item.senderPhoneNumber))
            getDocs(dbRef).then((querySnapshot) => {
                if (querySnapshot.empty) {
                    setSenderBankInfo(null)
                } else {
                    querySnapshot.forEach((docs) => {
                        const ref = doc(db, 'users', docs.id, 'verification', item.senderPhoneNumber)
                        getDoc(ref).then((doc) => {
                            if (doc.exists()) {
                                const data = doc.data() as BankInfo
                                setSenderBankInfo(data)
                            } else {
                                setSenderBankInfo(null)
                            }
                        })
                    })
                }
            })
        }
    }, [item.receiverInfo.phoneNumber, item.senderPhoneNumber])

    const handleAccept = () => {
        const ref = doc(db, 'transactions', item.uid)
        updateDoc(ref, {
            status: 'finish',
        }).then(() => {
            setExpanded(false)
            setDialog(false)
        })
    }

    return (
        <Stack
            sx={{
                padding: 1,
            }}>
            <Stack
                direction={'row'}>
                <Button
                    variant={'text'}
                    onClick={() => setExpanded(!expanded)}>
                    Detail
                </Button>
            </Stack>
            <Collapse in={expanded}>

                <Stack
                    gap={2}>
                    <Card
                        sx={{
                            padding: 2,
                        }}
                        variant={'outlined'}>
                        <Typography variant={'h6'}>
                            Detail Penerima
                        </Typography>
                        <Stack
                            direction={'row'}
                            gap={2}>
                            Nama:
                            <Typography>
                                {item.receiverInfo.displayName}
                            </Typography>
                        </Stack>
                        <Stack
                            direction={'row'}
                            gap={2}>
                            Nomor HP:
                            <Typography>
                                {item.receiverInfo.phoneNumber}
                            </Typography>
                        </Stack>
                        <Stack
                            direction={'row'}
                            gap={2}>
                            Atas Nama Bank:
                            <Typography>
                                {bankInfo?.bankAccountName}
                            </Typography>
                        </Stack>
                        <Stack
                            direction={'row'}
                            gap={2}>
                            Nama Bank:
                            <Typography>
                                {bankInfo?.bankName}
                            </Typography>
                        </Stack>
                        <Stack
                            direction={'row'}
                            gap={2}>
                            Nomor Rekening:
                            <Typography>
                                {bankInfo?.bankAccount}
                            </Typography>
                        </Stack>
                    </Card>
                    <Card
                        sx={{
                            padding: 2,
                        }}
                        variant={'outlined'}>
                        <Typography variant={'h6'}>
                            Detail Pembeli
                        </Typography>
                        <Stack
                            direction={'row'}
                            gap={2}>
                            Nomor HP:
                            <Typography>
                                {item.senderPhoneNumber}
                            </Typography>
                        </Stack>
                        <Stack
                            direction={'row'}
                            gap={2}>
                            Atas Nama Bank:
                            <Typography>
                                {senderBankInfo?.bankAccountName}
                            </Typography>
                        </Stack>
                        <Stack
                            direction={'row'}
                            gap={2}>
                            Nama Bank:
                            <Typography>
                                {senderBankInfo?.bankName}
                            </Typography>
                        </Stack>
                        <Stack
                            direction={'row'}
                            gap={2}>
                            Nomor Rekening:
                            <Typography>
                                {senderBankInfo?.bankAccount}
                            </Typography>
                        </Stack>
                    </Card>
                    <Stack
                        direction={'row-reverse'}>
                        <Button
                            onClick={() => setDialog(true)}
                            variant={'contained'}>
                            Selesaikan
                        </Button>
                    </Stack>
                </Stack>

            </Collapse>
            <Dialog
                onClose={() => setDialog(false)}
                open={dialog}>
                <DialogTitle>
                    <Typography
                        variant={'body1'}>
                        Konfirmasi
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography
                        variant={'body2'}>
                        Apakah kamu yakin untuk menyelesaikan dari transaksi ini
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDialog(false)}>
                        Batalkan
                    </Button>
                    <Button
                        variant={"contained"}
                        onClick={handleAccept}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}

export { Admin };
