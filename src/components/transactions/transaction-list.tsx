import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import { ITransactions } from "interfaces";
import { useState } from "react";

const TransactionList = (props: {
    transactions: ITransactions[],
    onSelect?: (transaction: ITransactions) => void
}) => {
    const { transactions } = props

    const [active, setActive] = useState('')

    return (
        <Stack
            direction={'column'}>
            {
                transactions?.map((transaction) => {
                    return (
                        <Item
                            activeChat={active === transaction.id}
                            key={transaction.id}
                            onClick={(e) => setActive(e)}
                            onSelect={(e) => { props?.onSelect && props.onSelect(e) }}
                            transaction={transaction} />
                    )
                })
            }
        </Stack>
    )

}


const Item = (props: {
    transaction: ITransactions,
    activeChat: boolean,
    onClick?: (uid: string) => void,
    onSelect?: (transaction: ITransactions) => void
}) => {

    const getStatus = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'Aktif'
            case 'pending':
                return 'Pending'
            case 'settlement':
                return 'Sukses'
            case 'expire':
                return 'Kadaluarsa'
            case 'done':
                return 'Selesai'
            case 'refund':
                return 'Refund'
            default:
                return 'Aktif'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'blue'
            case 'pending':
                return 'yellow'
            case 'settlement':
                return 'green'
            case 'expire':
                return 'red'
            case 'refund':
                return 'red'
            case 'done':
                return 'green'
            default:
                return 'blue'
        }
    }

    return (
        <Box
            onClick={() => {
                props?.onClick && props?.onClick(props?.transaction?.id)
                props?.onSelect && props?.onSelect(props?.transaction)
            }}
            sx={
                {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2,
                    px: 2,
                    justifyContent: 'space-between',
                    '&:hover': {
                        background: '#f3f5f7',
                        cursor: 'pointer'
                    },
                    ...(props.activeChat ? {
                        background: '#f3f5f7',
                    } : {
                        background: 'white',
                    })
                }}>
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ py: 2 }}>
                <Avatar sx={{ width: 40, height: 40 }} />
                <Stack spacing={0} direction={'column'}>
                    <Typography variant={'body1'}>
                        {
                            props.transaction.transactionName?.toString()
                        }
                    </Typography>
                    <Typography variant={'body2'}>
                        <Chip
                            size={'small'}
                            label={
                                Number(props.transaction.transactionAmount).toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR'
                                })
                            } />

                    </Typography>
                </Stack>
            </Stack>
            <Typography
                color={
                    getStatusColor(props.transaction?.status)
                }
                variant={'body2'}>{getStatus(props?.transaction?.status)}</Typography>
        </Box>
    )
}
export { TransactionList };

