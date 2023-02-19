import { Box, Card, Stack, Typography } from "@mui/material";
import googlePlay from 'assets/images/google-play-badge.png';
import logo from 'assets/images/logo.png';
import mask from 'assets/images/mask-signin.svg';
import { useSignIn } from "hooks";
import QRCode from "react-qr-code";
import React from "react";
import { useFirebases } from "utils";
import { useNavigate } from "react-router-dom";

const bc = new BroadcastChannel('sw-messages')

const SignIn: React.FC = () => {

    const {verificationId} = useSignIn()
    const {signIn} = useFirebases()
    const navigate = useNavigate()
    bc.onmessage = (ev) => {
        if (ev.data?.data?.verificationId === verificationId) {
            signIn(ev.data?.data.token).then(r => {
                navigate('/chats')
            })
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: 'column',
                width: '100%',
                backgroundImage: `url(${mask})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                height: 'calc(100vh)',
                backgroundPosition: 'bottom',
            }}>
            <Stack
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                }}
                direction={'row'}>
                <img src={logo} alt="logo" width={60} height={70}/>
                <Typography
                    variant="h2" component="div" sx={{fontWeight: 'bold'}}>
                    EKBERIN
                </Typography>
            </Stack>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                <Card
                    sx={{
                        p: 5
                    }}
                    variant={"outlined"}>
                    <Stack
                        spacing={6}
                        direction={'row'}>
                        <Stack
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                            direction={'column'} spacing={3}>
                            <Typography
                                variant="h5" component="div" sx={{fontWeight: 'bold'}}>
                                Silahkan scan QR Code ini <br/>
                                dengan aplikasi Rekberin
                            </Typography>
                            <Stack direction={'column'} spacing={2}>
                                <Typography
                                    variant="body1" component="div">
                                    Belum punya aplikasi Rekberin?
                                </Typography>
                                <a href="pages/signin/signin#download">
                                    <img
                                        width={140}
                                        height={50}
                                        src={googlePlay}
                                        alt={'get on google play'}/>
                                </a>
                            </Stack>
                        </Stack>
                        <Stack
                            sx={{
                                textAlign: 'center'
                            }}
                            direction={'column'}>
                            <QRCode
                                value={verificationId}/>
                        </Stack>
                    </Stack>
                </Card>
            </Box>
        </Box>
    )
}

export { SignIn };

