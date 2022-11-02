import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import { ITransactions } from "interfaces";
import moment from "moment";
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
                            onSelect={(e) => {props?.onSelect && props.onSelect(e)}}
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
                            props.transaction.transactionName?.toString()?.toUpperCase()
                        }
                    </Typography>
                    <Typography variant={'body2'}>
                        <Chip
                            size={'small'}
                            label={
                                moment(props.transaction?.createdAt).format('YYYY-MMMM-DD HH:ss')?.toString()?.toLowerCase()

                            }/>
                            
                    </Typography>
                </Stack>
            </Stack>
            <Typography variant={'body2'}>{props?.transaction?.transactionType?.toString()?.toLowerCase()}</Typography>
        </Box>
    )
}
export { TransactionList };

