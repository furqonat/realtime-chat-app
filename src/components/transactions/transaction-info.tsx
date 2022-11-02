import {
    Autocomplete, FormControl,
    FormControlLabel, FormLabel,
    OutlinedInput, Radio, RadioGroup,
    Stack, TextField, Typography
} from "@mui/material"
import { IContact, TransactionObject } from "interfaces"
import { useState } from "react"


const transactionType = [
    'REKBER',
    'PULBER'
]


// FIXME: firebase allways read data 
const TransactionInfo = (props: {
    contact: IContact,
    onClick: (transactions?: TransactionObject) => void
}) => {

    const [title, setTitle] = useState('')
    const [amount, setAmount] = useState('')
    const [fee, setFee] = useState(0)
    const [type, setType] = useState('REKBER')
    const [status, setStatus] = useState('legal')

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTitle(event.target.value)
    }

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.target.value) {
            // accept only number
            if (event.target.value !== '' && event.target.value.match(/^[0-9]*$/)) {
                setAmount(event.target.value)
                const value = event.target.value
                if (value) {
                    if (Number(value) > 0) {
                        const fees = 10000
                        if (Number(value) <= 5000000) {
                            setFee(fees)
                        } else {
                            const realFee = Number(value) / 5000000
                            setFee(Math.ceil(realFee) * fees)
                        }
                        const transactions: TransactionObject = {
                            transactionName: title,
                            transactionAmount: Number(event.target.value),
                            transactionFee: fees,
                            transactionType: type,
                            transactionStatus: status,
                            receiverInfo: props.contact,
                        }
                        props.onClick(transactions)
                    } else {
                        return
                    }
                } else {
                    return
                }
            }
        } else {
            setAmount('')
            props.onClick()
        }
    }


    return (
        <Stack
            spacing={1}
            direction={'column'}>
            <Typography variant={'body1'}>Nama transaksi</Typography>
            <OutlinedInput
                value={title}
                onChange={handleChangeTitle}
                size={'small'}
                placeholder={'Contoh: Pembelian Akun PUBG'} />
            <Typography variant={'body1'}>Informasi penerima</Typography>
            <Stack
                spacing={2}
                justifyContent={'space-between'}
                direction={'row'}>
                <OutlinedInput
                    disabled={true}
                    fullWidth={true}
                    size={'small'}
                    value={props.contact.displayName} />
                <OutlinedInput
                    disabled={true}
                    fullWidth={true}
                    size={'small'}
                    value={props.contact.phoneNumber} />
            </Stack>
            <Typography variant={'body1'}>Tipe transaksi</Typography>
            <Stack
                spacing={2}
                justifyContent={'space-between'}
                alignItems={'center'}
                direction={'row'}>
                <Autocomplete
                    sx={{
                        display: 'inline-flex',
                        width: '100%'
                    }}
                    value={type}
                    onChange={(_event, newValue) => {
                        if (newValue) {
                            setType(newValue)
                        }
                    }}
                    size={'small'}
                    options={transactionType}
                    renderInput={(params) => <TextField {...params} />} />
                <FormControl
                    sx={{
                        display: 'inline-flex',
                        width: '100%'
                    }}>
                    <FormLabel component={"span"}>
                        <Typography variant={'body2'}>
                            Jenis transaksi
                        </Typography>
                    </FormLabel>
                    <RadioGroup
                        row={true}
                        value={status}
                        onChange={(_event, newValue) => {
                            if (newValue) {
                                setStatus(newValue)
                            }
                        }}
                        aria-labelledby={"demo-row-radio-buttons-group-label"}
                        name={"row-radio-buttons-group"}>
                        <FormControlLabel value="legal" control={<Radio size={'small'} />} label="Legal" />
                        <FormControlLabel value="ilegal" control={<Radio size={'small'} />} label="Ilegal" />
                    </RadioGroup>
                </FormControl>
            </Stack>
            <Typography variant={'body1'}>Total pembayaran</Typography>
            <Stack
                spacing={2}
                justifyContent={'space-between'}
                direction={'row'}>
                <OutlinedInput
                    value={amount}
                    onChange={handleAmountChange}
                    fullWidth={true}
                    placeholder={'Jumlah'}
                    size={'small'}
                />
                <OutlinedInput
                    value={fee}
                    disabled={true}
                    fullWidth={true}
                    placeholder={'0'}
                    size={'small'} />
            </Stack>
        </Stack>
    )
}

export { TransactionInfo }

