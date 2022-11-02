import { Box, Stack } from "@mui/material"
import { ITransactions } from "interfaces"

const TransactionItem = (props: { transaction: ITransactions }) => {

    const { transactionName } = props.transaction

    return (
        <Stack
            component={'main'}
            direction={'column'}
            sx={{
                height: 'calc(100vh)'
            }}>
            <Box component={'header'}>
                <Stack
                    direction={'row'}
                    alignItems={'center'}>
                    <Stack
                        direction={'column'}>
                        {transactionName}
                    </Stack>
                </Stack>
            </Box>
        </Stack>
    )
}

export { TransactionItem }