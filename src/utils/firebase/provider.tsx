import { initializeApp } from "firebase/app"
import {
    ApplicationVerifier, ConfirmationResult,
    getAuth, onAuthStateChanged, signInWithPhoneNumber, signOut
} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const firebaseConfig = {
    apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
    authDomain: `${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}`,
    projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
    storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}`,
    messagingSenderId: `${process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID}`,
    appId: `${process.env.REACT_APP_FIREBASE_APP_ID}`,
    measurementId: `${process.env.REACT_APP_FIREBASE_MEASUREMENT_ID}`
}

const app = initializeApp(firebaseConfig)


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const db = getFirestore(app)
const auth = getAuth()

const useFirebase = () => {
    const router = useLocation()
    const navigate = useNavigate()
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log(user)
            if (!user && router.pathname !== '/' && router.pathname !== '/signin/qr/verify') {
                navigate('/')
            }
        })

        return () => unsubscribe()
    }, [router.pathname, navigate])


    const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: ApplicationVerifier) => {
        const signin = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
        setConfirmationResult(signin)
    }

    const logout = async () => {
        return signOut(auth)
    }

    return {
        confirmationResult,
        signInWithPhone,
        logout
    }
}

const firebaseContext = createContext({
    confirmationResult: null as ConfirmationResult | null,
    signInWithPhone: async (_phoneNumber: string, _recaptchaVerifier: ApplicationVerifier) => { },
    logout: async () => { }
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

const useFirebases = () => useContext(firebaseContext)

export { FirebaseProvider, useFirebases }
