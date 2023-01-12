import { EditOutlined } from "@mui/icons-material"
import { Avatar, Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, OutlinedInput, Paper, Stack, Typography } from "@mui/material"
import { doc, updateDoc } from "firebase/firestore"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useVerification } from "hooks"
import { useState } from "react"
import { db, useFirebases } from "utils"


const Person = () => {

    const { user } = useFirebases()
    const { verification } = useVerification({
        uid: user?.uid
    })

    const [name, setName] = useState(user?.displayName ?? '')
    const [email, setEmail] = useState(user?.email ?? '')
    const [avatar, setAvatar] = useState(user?.photoURL ?? '')
    const [dialog, setDialog] = useState(false)
    const [progress, setProgress] = useState(0)


    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }
    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0]
        if (file) {
            setProgress(0)
            setDialog(true)
            const storage = getStorage()
            const docRef = doc(db, 'users', `${user.uid}`)
            const storageRef = ref(storage, `${user.uid}/avatar/${file.name}`)
            const task = uploadBytesResumable(storageRef, file)
            task.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setProgress(progress)
            }, (error) => {
                console.log(error)
            }, () => {
                console.log('upload success')
                getDownloadURL(task.snapshot.ref).then((url) => {
                    setAvatar(url)
                    updateDoc(docRef, {
                        photoURL: url
                    }).then(() => {
                        setDialog(false)
                        setProgress(0)
                    })
                })
            })
        }
    }

    const openNewTab = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh)',
            }}>
            <Paper
                variant={'outlined'}
                component={'header'}
                sx={{
                    p: 2,
                    display: 'flex',
                }}>
                <Stack
                    direction={'column'}
                    spacing={2}>
                    <Stack
                        direction={'row'}
                        spacing={2}
                        alignItems={'center'}>
                        <Avatar
                            src={avatar}
                            sx={{
                                width: 50,
                                height: 50
                            }} />
                        <Stack
                            direction={'column'}>
                            <Typography variant={'h6'}>{user?.displayName ?? "Tidak ada nama"}</Typography>
                            <Typography variant={'body1'}>{user?.phoneNumber}</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Paper>
            <Stack
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    gap: 2,
                    flex: 1,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '0.4em',
                    },
                    '&::-webkit-scrollbar-track': {
                        borderRadius: '20px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#dadada',
                    }
                }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <label
                        style={{
                            cursor: 'pointer'
                        }}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100
                            }}
                            src={avatar}
                            component={'image'} />
                        <input type="file" hidden={true} onChange={handleChangeAvatar} />
                    </label>
                </Box>
                <Typography variant={'h6'}>Informasi Umum</Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <OutlinedInput
                        value={name}
                        onChange={handleChangeName}
                        size={'small'}
                        fullWidth={true}
                        placeholder={'Nama Lengkap'} />
                    <OutlinedInput
                        value={user?.phoneNumber}
                        disabled={true}
                        size={'small'}
                        fullWidth={true}
                        placeholder={'Nomor Telepone'} />
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <OutlinedInput
                        value={email}
                        onChange={handleChangeEmail}
                        size={'small'}
                        fullWidth={true}
                        placeholder={'Email'} />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                    }}>
                    <Typography variant={'h6'}>Informasi Data Diri</Typography>
                    <IconButton
                        onClick={() => {
                            openNewTab('/account/verify')
                        }}>
                        <EditOutlined />
                    </IconButton>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <OutlinedInput
                        disabled={true}
                        value={verification?.name}
                        size={'small'}
                        fullWidth={true}
                        placeholder={'Nama Lengkap'} />
                    <OutlinedInput
                        value={verification?.nik}
                        disabled={true}
                        size={'small'}
                        fullWidth={true}
                        placeholder={'NIK'} />
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <OutlinedInput
                        disabled={true}
                        value={verification?.address}
                        size={'small'}
                        fullWidth={true}
                        placeholder={'Alamat'} />
                    <OutlinedInput
                        value={verification?.dob}
                        disabled={true}
                        size={'small'}
                        fullWidth={true}
                        placeholder={'Tanggal Lahir'} />
                </Box>

                <Stack
                    gap={2}>
                    <Typography variant="h6">
                        Informasi Bank
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <OutlinedInput
                            disabled={true}
                            value={verification?.bankAccount?.replace(/./g, "*")}
                            size={'small'}
                            fullWidth={true}
                            placeholder={'NO Rekening'} />
                        <OutlinedInput
                            value={verification?.bankAccountName}
                            disabled={true}
                            size={'small'}
                            fullWidth={true}
                            placeholder={'Nama Bank'} />
                    </Box>
                    <OutlinedInput
                        value={verification?.bankName}
                        disabled={true}
                        size={'small'}
                        fullWidth={true}
                        placeholder={'Nama Bank'} />
                </Stack>
            </Stack>

            <Dialog
                open={dialog}>
                <DialogTitle>Upload Avatar</DialogTitle>
                <DialogContent>
                    <CircularProgress variant="determinate" value={progress} />
                </DialogContent>
            </Dialog>

        </Box>
    )
}

export { Person }

