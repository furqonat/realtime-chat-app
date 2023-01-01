import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "utils"


interface Verification {
    image: string,
    address: string,
    name: string,
    nik: string,
    dob?: string,
    date?: string,
    bankName?: string,
    bankAccount?: string,
    bankAccountName?: string,
}

const useVerification = (props: {
    uid?: string
}) => {

    const [verification, setVerification] = useState<Verification | null>(null)

    useEffect(() => {
        if (props?.uid) {
            const docRef = doc(db, 'users', props.uid, 'verification', props.uid)
            const unsubscribe = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    setVerification(doc.data() as Verification)
                }
            })
            return () => unsubscribe()
        } else {
            return () => { }
        }
    }, [props?.uid])
    return { verification }
}

export { useVerification }