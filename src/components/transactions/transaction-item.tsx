import { Alert, Divider, Paper, Snackbar, Stack, Typography } from "@mui/material"
import { ITransactions } from "interfaces"
import moment from "moment"
import { useState } from "react"

const TransactionItem = (props: { transaction: ITransactions }) => {

    const {
        transactionName,
        transactionAmount,
        createdAt,
        status,
        transactionType,
        transactionStatus,
        id,
    } = props.transaction


    const [alertDialog, setAlertDialog] = useState(false)

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
                        <Stack>

                        </Stack>
                    </Stack>
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
        </Stack>
    )
}

export { TransactionItem }

