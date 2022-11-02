import { Avatar, Box, Grid, Paper, Stack, Typography } from "@mui/material"
import { useFirebases } from "utils"


const Person = () => {

    const { user } = useFirebases()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
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
            <Grid container>
                <Grid item xs={4}>
                    <Stack
                        sx={{
                            display: 'flex',
                            flex: 1,
                            p: 2,
                            gap: 2,
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': {
                                display: 'none'
                            }
                        }}
                        component={'main'}
                        direction={'column'}>

                        <Typography variant={'h5'}>Pengaturan</Typography>
                        <Stack
                            sx={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                                overflowY: 'auto',
                                '&::-webkit-scrollbar': {
                                    display: 'none'
                                },

                            }}
                            component={'section'}>
                            <Box
                                sx={{
                                    cursor: 'pointer',
                                    py: 2,
                                    px: 1,
                                    '&:hover': {
                                        background: '#f3f5f7',
                                        cursor: 'pointer'
                                    }
                                }}>
                                <Typography
                                    variant={'body1'}>
                                    Ubah Informasi Akun
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    cursor: 'pointer',
                                    py: 2,
                                    px: 1,
                                    '&:hover': {
                                        background: '#f3f5f7',
                                        cursor: 'pointer'
                                    }
                                }}>
                                <Typography
                                    variant={'body1'}>
                                    Ubah Informasi Akun
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                </Grid>
            </Grid>
        </Box>
    )
}

export { Person }

