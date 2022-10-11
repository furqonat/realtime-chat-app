import { Box, Button, Card, Drawer, OutlinedInput, Stack, Typography } from "@mui/material"
import logo from 'assets/images/logo.png'
import { BaseLayout, VerificationCode } from "components"
import { ApplicationVerifier, getAuth, RecaptchaVerifier } from "firebase/auth"
import React, { useEffect, useRef, useState } from "react"
import { useFirebases } from "utils"


const SignIn: React.FC = () => {

    const [code, setCode] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [error, setError] = useState(false)
    const [open, setOpen] = useState(false)
    const [provider, setProvider] = useState('phone')

    const [captcha, setCaptcha] = useState<ApplicationVerifier | null>(null)
    const ref = useRef<HTMLDivElement>(null)

    const {signInWithPhone, signInWithWhatsApp, verifyCode} = useFirebases()

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // accept only number and +
        setPhoneNumber(e.target.value)
    }

    const handleSumbit = () => {
        setProvider('phone')
        if (phoneNumber.length < 10) {
            setError(true)
            return
        }
        setError(false)
        signInWithPhone(`+62${phoneNumber}`, captcha!!).then(() => {
            setOpen(true)
        })
    }

    const handleSubmitWa = () => {
        setProvider('whatsapp')
        if (phoneNumber.length < 10) {
            return
        }
        setError(false)
        signInWithWhatsApp(`+62${phoneNumber}`)
    }

    const handleComplete = (data: string) => {
        provider === 'phone' ? verifyCode(data, "phone") : verifyCode(data, 'whatsapp')
    }

    useEffect(() => {
        const verify = new RecaptchaVerifier(ref.current, {
            size: 'invisible',
        }, getAuth())
        verify.render().then(_e => { })
        setCaptcha(verify)
        return () => {
            verify.clear()
        }
    }, [])

    return (
        <BaseLayout
            dir="column">
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2
                }}>
                <img
                    width="100%"
                    height="100%"
                    alt={'logo'}
                    src={logo} />
                <Card
                    color={'paper'}
                    sx={{
                        zIndex: 999,
                        backgroundColor: "white",
                        width: "100%",
                        height: document.body.clientHeight * 0.5 - 10,
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                        mt: '-100px',
                        p: 2,
                        position: 'relative'
                    }}
                    elevation={2}>
                    <Stack
                        spacing={4}
                        direction={'column'}>
                        <Typography
                            sx={{
                                textAlign: 'center'
                            }}
                            variant={'h6'}>Masukan nomor nelepon untuk melanjutkan</Typography>

                        <OutlinedInput
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            size={'small'}
                            startAdornment={<Typography pr={2}>+62</Typography>}
                            sx={{
                                borderRadius: 3,
                            }}
                            error={error}
                            type={'number'}
                            placeholder={'Nomor Telepon'}
                        />

                        <Button
                            variant={'contained'}
                            color={'primary'}
                            onClick={handleSumbit}>
                            Kirim Kode
                            </Button>
                    </Stack>

                </Card>
            </Box>
            <Drawer
                anchor={'bottom'}
                open={open}>
                <Box
                    sx={{
                        display: 'flex',
                        p: 2,
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}>
                    <Typography variant={'h6'}>Masukan kode verifikasi</Typography>

                    <Typography variant={'caption'}>Kode akan kadaluarsa dalam 2 menit</Typography>
                    <VerificationCode
                        code={code}
                        onCompleted={handleComplete}
                        onChange={setCode} />
                    <Typography variant={'caption'}>Kode tidak diterima?</Typography>
                    <Button
                        onClick={handleSubmitWa}
                        variant={'contained'}
                        color={'success'}>
                        Kirim kode ke Whatsapp
                    </Button>
                </Box>
            </Drawer>
            <div ref={ref}></div>
        </BaseLayout>
    )
}

export { SignIn }

