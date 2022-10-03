import { initializeApp } from "firebase/app"
import {
    ApplicationVerifier, ConfirmationResult,
    getAuth, onAuthStateChanged, signInWithPhoneNumber, signOut
} from "firebase/auth"
import { doc, getFirestore, updateDoc } from "firebase/firestore"
import { IUser } from "interfaces"
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


const db = getFirestore(app)
const auth = getAuth()

const formatUser = (user: IUser) => {
    return {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber
    }
}

const useFirebase = () => {
    const router = useLocation()
    const navigate = useNavigate()
    const [user, setUser] = useState<IUser>(null)
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user && router.pathname !== '/' && router.pathname !== '/signin/qr/verify') {
                navigate('/')
                return
            }
            setUser(formatUser(user))
        })

        return () => unsubscribe()
    }, [router.pathname, navigate])


    const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: ApplicationVerifier) => {
        const signin = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
        setConfirmationResult(signin)
    }

    const logout = async () => {
        const dbRef = doc(db, 'users', user.phoneNumber)
        return updateDoc(dbRef, {
            status: new Date().toISOString()
        }).then(() => {
            signOut(auth)
        })
    }

    return {
        confirmationResult,
        signInWithPhone,
        logout,
        user
    }
}

const firebaseContext = createContext({
    confirmationResult: null as ConfirmationResult | null,
    signInWithPhone: async (_phoneNumber: string, _recaptchaVerifier: ApplicationVerifier) => { },
    logout: async () => { },
    user: null as IUser
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

export { FirebaseProvider, useFirebases, db }
