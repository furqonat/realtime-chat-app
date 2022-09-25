import { ApplicationVerifier, getAuth, RecaptchaVerifier } from "firebase/auth";
import { useAppDispatch } from "hooks";
import { useEffect } from "react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setPhone } from "redux/phoneReducer";
import { useFirebases } from "utils";


const SignInQr = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const { signInWithPhone } = useFirebases()
  const capcha = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [verify, setVerify] = useState<ApplicationVerifier>()
  const dispatch = useAppDispatch()
  const handleClick = () => {
    // menyimpan nomor telepon ke redux
    dispatch(setPhone(phoneNumber))
    signInWithPhone(phoneNumber, verify!!).then(
      (_) => {
        navigate('/signin/qr/verify')
      }
    )
  }
  useEffect(() => {
    const p = new RecaptchaVerifier(capcha.current as HTMLDivElement, {}, getAuth())
    p.render().then(_e => { })
    setVerify(p)
  }, [capcha])
  return (
    <div>
      <input
        type={'text'}
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)} />
      <div ref={capcha} />
      <button
        onClick={handleClick}
      >Sign in</button>
    </div>
  )
}

export {SignInQr}