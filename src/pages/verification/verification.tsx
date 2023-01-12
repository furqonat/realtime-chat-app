import { ImageOutlined } from "@mui/icons-material"
import { AppBar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, OutlinedInput, Stack, Toolbar, Typography } from "@mui/material"
import { getAuth, updateEmail, updateProfile } from "firebase/auth"
import { doc, setDoc, updateDoc } from "firebase/firestore"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useVerification } from "hooks"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { db, useFirebases } from "utils"


const Verification = () => {

    const { user } = useFirebases()
    const { verification } = useVerification({
        phoneNumber: user?.phoneNumber
    })
    const navigate = useNavigate()

    const [displayName, setDisplayName] = useState(user?.displayName ?? '')
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? '')
    const [email, setEmail] = useState(user?.email ?? '')

    // valid user data
    const [image, setImage] = useState('')
    const [name, setName] = useState('')
    const [nik, setNik] = useState('')
    const [address, setAddress] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [birthDate, setBirthDate] = useState('')
    const [bankName, setBankName] = useState('')
    const [bankAccount, setBankAccount] = useState('')
    const [bankAccountName, setBankAccountName] = useState('')


    // dialog
    const [open, setOpen] = useState(false)
    const [disable, setDisable] = useState(true)


    useEffect(() => {
        if (
            image.length > 0 &&
            name.length > 0 &&
            nik.length > 10 &&
            address.length > 0 &&
            displayName.length > 0 &&
            phoneNumber.length > 5 &&
            email.length > 2 &&
            birthDate.length > 2 &&
            bankName.length > 0 &&
            bankAccount.length > 0 &&
            bankAccountName.length > 0
        ) {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }, [address.length, bankAccount.length, bankAccountName.length, bankName.length, birthDate.length, displayName.length, email.length, file, image.length, name.length, nik.length, phoneNumber.length, user])

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName ?? '')
            setPhoneNumber(user.phoneNumber ?? '')
            setEmail(user.email ?? '')
        }
        if (verification) {
            setImage(verification.image ?? '')
            setName(verification.name ?? '')
            setNik(verification.nik ?? '')
            setAddress(verification.address ?? '')
            setBirthDate(verification.dob ?? '')
            setBankName(verification.bankName ?? '')
            setBankAccount(verification.bankAccount ?? '')
            setBankAccountName(verification.bankAccountName ?? '')
        }
    }, [user, verification])



    const handleDisplayName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDisplayName(e.target.value)
    }

    const handleDispayNameOnBlur = async () => {
        const auth = getAuth()
        await updateProfile(auth.currentUser, {
            displayName
        })
    }

    const handlePhoneNumber = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPhoneNumber(e.target.value)
    }

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEmail(e.target.value)
    }

    const handleEmailOnBlur = async () => {
        const auth = getAuth()
        await updateEmail(auth.currentUser, email)
    }

    const handleChangeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                setImage(reader.result as string)
            }
            setFile(file)
        }
    }


    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setName(e.target.value)
    }

    const handleChangeNik = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNik(e.target.value)
    }

    const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAddress(e.target.value)
    }

    const handleChangeBirthDate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBirthDate(e.target.value)
    }
    const handleChangeBankName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBankName(e.target.value)
    }

    const handleChangeBankAccount = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBankAccount(e.target.value)
    }
    const handleChangeBankAccountName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBankAccountName(e.target.value)
    }

    const handleOnSubmit = () => {
        if (!disable) {
            const docRef = doc(db, 'users', user?.phoneNumber)
            const docUserRef = doc(db, 'users', user?.phoneNumber, 'verification', user?.phoneNumber)
            const storage = getStorage()
            const storageRef = ref(storage, `users/${user?.phoneNumber}/id-card`)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done')
            }, (error) => {
                console.log(error)
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    updateDoc(docRef, {
                        displayName: displayName,
                        email: email,
                    }).then(() => {
                        setDoc(docUserRef, {
                            name: name,
                            nik: nik,
                            address: address,
                            image: downloadURL,
                            dob: birthDate,
                            date: new Date().toISOString(),
                            bankName: bankName,
                            bankAccount: bankAccount,
                            bankAccountName: bankAccountName,
                        }).then(() => {
                            setOpen(false)
                            navigate('/chats')
                        })
                    })
                })
            })
        } else {
            setOpen(false)
        }
    }


    return (
        <Stack
            direction={'column'}>
            <AppBar
                elevation={0}>
                <Toolbar>
                    <Typography
                        variant={'h6'}>
                        Akun Verifikasi
                    </Typography>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Stack
                width={'70%'}
                mx={'auto'}
                mt={3}
                gap={1}
                direction={'column'}>
                <Stack
                    gap={1}>
                    <Typography variant={'h6'}>
                        Informasi Umum
                    </Typography>
                    <Stack
                        gap={2}
                        justifyContent={'space-between'}
                        direction={'row'}>
                        <OutlinedInput
                            onBlur={handleDispayNameOnBlur}
                            value={displayName}
                            onChange={handleDisplayName}
                            fullWidth={true}
                            placeholder={'Nama Lengkap'}
                            sx={{
                                borderRadius: '10px'
                            }}
                            size={'small'} />
                        <OutlinedInput
                            disabled={true}
                            value={phoneNumber}
                            onChange={handlePhoneNumber}
                            fullWidth={true}
                            sx={{
                                borderRadius: '10px'
                            }}
                            placeholder={'Nomor Telepon'}
                            size={'small'} />
                    </Stack>
                    <OutlinedInput
                        onBlur={handleEmailOnBlur}
                        type={'email'}
                        value={email}
                        onChange={handleEmail}
                        fullWidth={true}
                        sx={{
                            borderRadius: '10px'
                        }}
                        placeholder={'Email'}
                        size={'small'} />
                </Stack>
                <Stack
                    gap={1}>
                    <Typography variant={'h6'}>
                        Informasi Data Diri
                    </Typography>
                    <Stack
                        sx={{
                            border: '1px dashed #e0e0e0',
                            borderRadius: '10px',
                        }}
                        height={'200px'}
                        width={'100%'}
                        alignItems={'center'}
                        justifyContent={'center'}>
                        {
                            image.length > 0 ?
                                (
                                    <Box
                                        sx={{
                                            cursor: 'pointer'
                                        }}
                                        display={'flex'}
                                        flexDirection={'column'}
                                        padding={2}>
                                        <Box
                                            onClick={() => setImage("")}
                                            component={'img'}
                                            alt={'KTP'}
                                            sx={{
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                                width: '100%',
                                                maxHeight: '170px',
                                                borderRadius: '10px'
                                            }}
                                            src={image} />
                                    </Box>
                                )
                                :
                                (
                                    <>
                                        <label
                                            style={{
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}>
                                            <Typography
                                                height={'100%'}
                                                width={'100%'}
                                                variant={'body1'}>
                                                Unggah Foto KTP
                                            </Typography>
                                            <input
                                                accept="image/*"
                                                type="file"
                                                hidden={true}
                                                onChange={handleChangeUpload} />
                                            <ImageOutlined />
                                        </label>
                                    </>
                                )
                        }
                    </Stack>
                    <Stack
                        direction={'row'}
                        justifyContent={'space-between'}
                        gap={2}>
                        <OutlinedInput
                            value={name}
                            fullWidth={true}
                            onChange={handleChangeName}
                            sx={{
                                borderRadius: '10px'
                            }}
                            placeholder={'Nama Lengkap'}
                            size={'small'} />
                        <OutlinedInput
                            value={nik}
                            fullWidth={true}
                            onChange={handleChangeNik}
                            sx={{
                                borderRadius: '10px'
                            }}
                            placeholder={'Nomor KTP'}
                            size={'small'} />
                    </Stack>
                    <Stack
                        direction={'row'}
                        justifyContent={'space-between'}
                        gap={2}>
                        <OutlinedInput
                            value={address}
                            fullWidth={true}
                            onChange={handleChangeAddress}
                            sx={{
                                borderRadius: '10px'
                            }}
                            placeholder={'Alamat'}
                            size={'small'} />
                        <OutlinedInput
                            type="date"
                            value={birthDate}
                            fullWidth={true}
                            onChange={handleChangeBirthDate}
                            sx={{
                                borderRadius: '10px'
                            }}
                            placeholder={'Tanggal Lahir'}
                            size={'small'} />
                    </Stack>
                </Stack>
                <Stack
                    gap={1}>
                    <Typography variant={'h6'}>
                        Informasi Data Perbankan
                    </Typography>
                    <Stack
                        direction={'row'}
                        justifyContent={'space-between'}
                        gap={2}>
                        <OutlinedInput
                            value={bankAccount}
                            fullWidth={true}
                            onChange={handleChangeBankAccount}
                            sx={{
                                borderRadius: '10px'
                            }}
                            placeholder={'Nomor Rekening'}
                            size={'small'} />
                        <OutlinedInput
                            value={bankAccountName}
                            fullWidth={true}
                            onChange={handleChangeBankAccountName}
                            sx={{
                                borderRadius: '10px'
                            }}
                            placeholder={'Atas Nama'}
                            size={'small'} />
                    </Stack>
                    <OutlinedInput
                        value={bankName}
                        fullWidth={true}
                        onChange={handleChangeBankName}
                        sx={{
                            borderRadius: '10px'
                        }}
                        placeholder={'Atas Nama'}
                        size={'small'} />
                </Stack>
                <Stack
                    justifyContent={'flex-end'}
                    direction={'row'}>
                    <Button
                        disabled={disable}
                        onClick={() => setOpen(true)}
                        variant="contained">
                        Simpan
                    </Button>
                </Stack>
            </Stack>
            <Dialog
                open={open}>
                <DialogTitle>
                    <Typography
                        variant={'h6'}>
                        Konfirmasi
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography
                        variant={'body1'}>
                        Apakah anda yakin ingin menyimpan data ini?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpen(false)}
                        variant={'outlined'}>
                        Batal
                    </Button>
                    <Button
                        onClick={handleOnSubmit}
                        variant={'contained'}>
                        Simpan
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack >

    )
}

export { Verification }

