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
  const captcha = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [verify, setVerify] = useState<ApplicationVerifier>()
  const dispatch = useAppDispatch()
  const handleClick = () => {
    dispatch(setPhone(phoneNumber))
    signInWithPhone(phoneNumber, verify!!).then(
      (_) => {
        navigate('/signin/qr/verify')
      }
    )
  }
  useEffect(() => {
    const p = new RecaptchaVerifier(captcha.current as HTMLDivElement, {
        size: 'invisible',
    }, getAuth())
    p.render().then(_e => { })
    setVerify(p)
  }, [captcha])
  
  return (
    <div>
      <input
        type={'text'}
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)} />
      <div ref={captcha} />
      <button
        onClick={handleClick}
      >Sign in</button>
    </div>
  )
}

export {SignInQr}