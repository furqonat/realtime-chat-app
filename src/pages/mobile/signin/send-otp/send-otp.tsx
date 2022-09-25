import { Button } from "@mui/material"
import { Link } from "react-router-dom"
import './styles.css'
import { useAppSelector } from "hooks"

const SendOtp = () => {
  const phone = useAppSelector(state => state.phone.phoneNumber)

  return (
    <div className="container">
      <div className="logo">R</div>
      <div className="text-otp">
        Kami akan mengirimkan OTP ke nomor ini <br />
        Pastikan nomor anda benar
      </div>
      <div>
        <br/>
        {phone}
        <hr/>
      </div>
      <div className="btn-send">
      <Button className="btn-sms" variant="contained">Kirim SMS</Button>
        <br/>
          <Button className="btn-whatsapp"
          variant="outlined">Kirim whatsapp
          </Button>
          </div>
          <div className="link-number">
          <Link style={{textDecoration: 'none'}} to={'/'}>Ganti nomor telpon</Link>
          </div>
    </div>
  )
}

export  {SendOtp}