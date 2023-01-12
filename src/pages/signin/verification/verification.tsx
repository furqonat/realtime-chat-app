import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFirebases, db } from "utils"


const Verification = () => {
    const navigate = useNavigate()
    const { confirmationResult } = useFirebases()

    const [code, setCode] = useState('')
    const handleVerify = () => {
        confirmationResult?.confirm(code).then(
            async result => {
                if (result.user) {
                    const docRef = doc(db, 'users', result.user.phoneNumber)
                    const docSnap = await getDoc(docRef)
                    if (docSnap.exists()) {
                        updateDoc(docRef, {
                            lastLogin: new Date().toLocaleDateString()
                        }).then(() => {
                            navigate('/chats')
                        })
                    } else {
                        setDoc(doc(db, 'users', result.user.phoneNumber), {
                            phoneNumber: result.user.phoneNumber,
                            uid: result.user.uid,
                            displayName: result.user.displayName,
                            photoURL: result.user.photoURL,
                            email: result.user.email,
                            emailVerified: result.user.emailVerified,
                            isIDCardVerified: false,
                            lastLogin: new Date().toLocaleDateString()
                        }).then(() => {
                            navigate('/chats')
                        })
                    }
                    
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
