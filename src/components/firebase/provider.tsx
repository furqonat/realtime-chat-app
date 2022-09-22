import { initializeApp } from "firebase/app"
import { ApplicationVerifier, ConfirmationResult, getAuth, onAuthStateChanged, signInWithPhoneNumber } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { createContext, ReactNode, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const firebaseConfig = {
    apiKey: `${process.env.FIREBASE_API_KEY}`,
    authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}`,
    projectId: `${process.env.FIREBASE_PROJECT_ID}`,
    storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}`,
    messagingSenderId: `${process.env.FIREBASE_MESSAGING_SENDER_ID}`,
    appId: `${process.env.FIREBASE_APP_ID}`,
    measurementId: `${process.env.FIREBASE_MEASUREMENT_ID}`
}

const app = initializeApp(firebaseConfig)


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const db = getFirestore(app)
const auth = getAuth()

const useFirebase = () => {
    const router = useLocation()
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user && router.pathname !== '/signin' && router.pathname !== '/signup') {
                console.log('need login')
            }
        })

        return () => unsubscribe()
    }, [router.pathname])


    const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: ApplicationVerifier) => {
        const signin = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
        setConfirmationResult(signin)
    }

    return {
        confirmationResult,
        signInWithPhone
    }
}

const firebaseContext = createContext({
    confirmationResult: null as ConfirmationResult | null,
    signInWithPhone: async (phoneNumber: string, recaptchaVerifier: ApplicationVerifier) => { }
})

interface FirebaseProviderProps {
    children?: ReactNode
}
const FirebaseProvider = (props: FirebaseProviderProps) => {

    return (
        <firebaseContext.Provider value={useFirebase()}>
            {props.children}
        </firebaseContext.Provider>
    )
}

export { FirebaseProvider }
