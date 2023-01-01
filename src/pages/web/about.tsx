import { AppBar, Container, Stack, Toolbar, Typography } from "@mui/material"


const About = () => {

    return (
        <Container>
            <Stack
                gap={2}>
                <AppBar>
                    <Toolbar>
                        <Typography variant={'h5'}>Tentang Rekberin</Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar />
                <Toolbar />
                <Typography variant={'h5'}>
                    Aplikasi kami
                </Typography>
                <Typography variant={'body1'}>
                    REKBERIN adalah aplikasi berkirim pesan, panggilan yang sederhana dan bertransaksi yg sangat aman, dan reliabel, serta dapat diunduh ke ponsel di seluruh dunia secara gratis.
                    Nama REKBERIN merupakan plesetan dari Rekening bersama
                </Typography>
                <Typography variant={'h5'}>
                    Misi Kami
                </Typography>
                REKBERIN dimulai sebagai alternatif dari SMS. Saat ini, produk kami mendukung pengguna untuk mengirim dan menerima berbagai macam media: teks, foto, video, dokumen, lokasi, dan panggilan suara, serta dukungan bertransaksi. Sebagian momen pribadi Anda dibagikan melalui REKBERIN. Oleh karena itu, kami membangun enkripsi end-to-end dalam aplikasi kami. Di balik setiap keputusan produk terdapat keinginan kami untuk memungkinkan orang-orang berkomunikasi di mana saja di dunia tanpa pembatas.

                <Typography variant={'h5'}>
                    Tim Kami
                </Typography>
                REKBERIN didirikan oleh Kingditho wulanesa mahardika. REKBERIN beroperasi sebagai aplikasi dengan fokus utama untuk membangun layanan berkirim pesan dan transaksi yang cepat dan reliabel di mana saja di dunia.

            </Stack>
        </Container>
    )
}

export { About }