import { Typography, Stack, Tabs, Tab, Box, Paper, Collapse, Chip, Button, Card } from "@mui/material"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { ITransactions, TransactionObject } from "interfaces";
import moment from "moment";
import { useEffect, useState } from "react"
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

interface VerificationAccount extends Omit<TransactionObject, 'id' | 'orderId' | 'reason' | 'createdAt'> {
    nik: string,
    image: string,
    name: string,
    dob: string,
    address: string,
    phoneNumber: string,
}

const Admin = () => {

    const [value, setValue] = useState(0)
    const [expanded, setExpanded] = useState(false)
    const [transaction, setTransaction] = useState<ITransactions[]>([])
    const [transactionRefund, setTransactionRefund] = useState<RefundData[]>([])
    const [transactionVerif, setTransactionVerif] = useState<VerificationAccount[]>([])

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    useEffect(() => {
        const dbRef = query(collection(db, 'transactions'), where('status', '==', 'done'))
        const dbRefRefund = query(collection(db, 'refunds'))
        const userRef = collection(db, 'users')
        getDocs(dbRef).then((querySnapshot) => {
            const data: ITransactions[] = []
            querySnapshot.forEach((doc) => {
                data.push(doc.data() as ITransactions)
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
                Item Two
            </TabPanel>
            <TabPanel
                value={value}
                index={2}>
                Item Three
            </TabPanel>

        </Stack>
    )
}

type BankInfo = Omit<RefundData, 'id' | 'reason' | 'createdAt'>

const Detail = (props: { item: ITransactions }) => {

    const [expanded, setExpanded] = useState(false)
    const [bankInfo, setBankInfo] = useState<BankInfo | null>(null)
    const [senderBankInfo, setSenderBankInfo] = useState<BankInfo | null>(null)

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
                            variant={'contained'}>
                            Selesaikan
                        </Button>
                    </Stack>
                </Stack>

            </Collapse>
        </Stack>
    )
}

export { Admin }