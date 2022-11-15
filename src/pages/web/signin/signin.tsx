import { Box, Card, Stack, Typography } from "@mui/material";
import googlePlay from 'assets/images/google-play-badge.png';
import logo from 'assets/images/logo.png';
import mask from 'assets/images/mask-signin.svg';
import { useSignIn } from "hooks";
import { encrypt } from "lib";
import { useEffect } from "react";
import QRCode from "react-qr-code";
import { useFirebases } from "utils";


const SignIn: React.FC = () => {

  const { verificationId, token } = useSignIn()
  const { signIn } = useFirebases()
  

  useEffect(() => {

    const hash = encrypt("secret salt")
    const data = JSON.stringify({
      phoneNumber: "+12345678911",
      verificationId: verificationId,
    }).toString()
    const hash2 = hash(data)
    console.log(hash2)
  }, [verificationId])

  useEffect(() => {
    if (token) {
      signIn(token).then((res) => {
        console.log(res,)
      })
    }
  }, [signIn, token])


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
        <img src={logo} alt="logo" width={60} height={70} />
        <Typography
          variant="h2" component="div" sx={{ fontWeight: 'bold' }}>
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
                variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                Silahkan scan QR Code ini <br />
                dengan aplikasi Rekberin
              </Typography>
              <Stack direction={'column'} spacing={2}>
                <Typography
                  variant="body1" component="div">
                  Belum punya aplikasi Rekberin?
                </Typography>
                <a href="#download">
                  <img
                    width={140}
                    height={50}
                    src={googlePlay}
                    alt={'get on google play'} />
                </a>
              </Stack>
            </Stack>
            <Stack
              sx={{
                textAlign: 'center'
              }}
              direction={'column'}>
              <QRCode
                value={verificationId} />
            </Stack>
          </Stack>
        </Card>
      </Box>
    </Box>
  )
}

export { SignIn }
