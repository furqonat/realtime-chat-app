import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "utils"


interface Verification {
    image: string,
    address: string,
    name: string,
    nik: string,
    dob?: string,
    date?: string
}

const useVerification = (props: {
    phoneNumber?: string
}) => {

    const [verification, setVerification] = useState<Verification | null>(null)

    useEffect(() => {
        if (props?.phoneNumber) {
            console.log('useVerification', props.phoneNumber)
            const docRef = doc(db, 'users', props.phoneNumber, 'verification', props.phoneNumber)
            const unsubscribe = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    setVerification(doc.data() as Verification)
                }
            })
            return () => unsubscribe()
        } else {
            return () => { }
        }
    }, [props?.phoneNumber])
    return { verification }
}

export { useVerification }