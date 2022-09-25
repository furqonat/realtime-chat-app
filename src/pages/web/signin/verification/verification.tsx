import { useAppSelector } from "hooks"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFirebases } from "utils"


const Verification = () => {
    const navigate = useNavigate()
    const { confirmationResult } = useFirebases()

    console.log(confirmationResult)
    // mendapatkan nomor telepon dari redux
    const phone = useAppSelector(state => state.phone.phoneNumber)
    console.log(phone)
    const [code, setCode] = useState('')
    const handleVerify = () => {
        confirmationResult?.confirm(code).then(
            (result) => {
                if (result.user) {
                    navigate('/chats')
                } else {
                    console.log('error')
                }
            })
    }
    return (
        <div>
            <h1>Verification</h1>
            <input
                type={'text'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={'Enter verification code'} />
            <button
                onClick={handleVerify}>
                Verify
            </button>
        </div>
    )
}

export { Verification }
