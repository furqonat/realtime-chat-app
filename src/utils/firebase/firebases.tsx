import axios from "axios"
import { initializeApp } from "firebase/app"
import {
    ApplicationVerifier, ConfirmationResult,
    getAuth, getIdToken, onAuthStateChanged, signInWithCustomToken, signInWithPhoneNumber, signOut, User
} from "firebase/auth"
import { doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore"
import { IUser } from "interfaces"
import {
    createContext, ReactNode, useContext, useEffect, useState
} from "react"
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
    const [verificationCode, setVerificationCode] = useState(0)
    const [phone, setPhone] = useState('')

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user && router.pathname !== '/' && router.pathname !== '/signin/qr/verify') {
                navigate('/')
            }
            // else if (user) {
            //     navigate('/chats')
            //     return
            // }
            // return
            setUser(formatUser(user))
        })

        return () => unsubscribe()
    }, [router.pathname, navigate])


    const assignUser = async (user: User, nextPage?: string) => {
        const dbRef = getFirestore(app)
        const docRef = doc(dbRef, 'users', `${user.phoneNumber}`)
        const data = await getDoc(docRef)
        if (data.exists()) {
            updateDoc(docRef, {
                lastLogin: new Date().toLocaleDateString()
            }).then(() => {
                nextPage && navigate(nextPage)
            })
        } else {
            setDoc(doc(dbRef, 'users', user.phoneNumber), {
                phoneNumber: user.phoneNumber,
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
                email: user.email,
                emailVerified: user.emailVerified,
                isIDCardVerified: false,
                lastLogin: new Date().toLocaleDateString()
            }).then(() => {
                nextPage && navigate(nextPage)
            })
        }
    }


    const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: ApplicationVerifier) => {
        setPhone(phoneNumber)
        const signin = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
        setConfirmationResult(signin)
    }

    const signInWithWhatsApp = async (phoneNumber: string) => {
        setPhone(phoneNumber)
        // send message to whatsapp
        const code = Math.floor(100000 + Math.random() * 900000)
        const sendMessage = await axios.post(`${process.env.REACT_APP_FB_BASE_URL}/${process.env.REACT_APP_PHONE_NUMBER_ID}/messages`, {
            messaging_product: 'whatsapp',
            to: phoneNumber.replace('+', ''),
            type: 'template',
            template: {
                language: {
                    code: "id"
                },
                name: 'verifikasi',
                components: [
                    {
                        type: 'body',
                        parameters: [
                            {
                                type: 'text',
                                text: code
                            }
                        ]
                    }
                ]
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.REACT_APP_FB_TOKEN}`
            }
        })
        if (sendMessage.status === 200) {
            setVerificationCode(code)
        }
    }

    const verifyCode = async (code: string, provider: "phone" | "whatsapp", nextPage?: string) => {
        if (provider === "phone") {
            if (confirmationResult) {
                confirmationResult.confirm(code)
                    .then(async result => {
                        assignUser(result.user, nextPage)
                        axios.post(`${process.env.REACT_APP_SERVER_URL}/claims`, {
                            token: await getIdToken(result.user),
                            phoneNumber: phone
                        }).then(async res => {
                            if (res.status === 200) {
                                console.log(res)
                                await getIdToken(result.user, true)
                                setUser(formatUser(result.user))
                            }
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        } else if (provider === "whatsapp") {
            if (verificationCode === parseInt(code)) {
                const wa = await axios.post(`${process.env.REACT_APP_SERVER_URL}/whatsapp`, {
                    phoneNumber: phone
                })
                if (wa.status === 200) {
                    signInWithCustomToken(auth, wa.data.token).then(async result => {
                        assignUser(result.user, nextPage)
                        axios.post(`${process.env.REACT_APP_SERVER_URL}/claims`, {
                            token: await getIdToken(result.user),
                            phoneNumber: phone
                        }).then(async res => {
                            if (res.status === 200) {
                                await getIdToken(result.user, true)
                                setUser(formatUser(result.user))
                            }
                        })
                    })
                }
            }
        }
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
        user,
        signInWithWhatsApp,
        verifyCode
    }
}

const firebaseContext = createContext({
    confirmationResult: null as ConfirmationResult | null,
    signInWithPhone: async (_phoneNumber: string, _recaptchaVerifier: ApplicationVerifier) => { },
    logout: async () => { },
    user: null as IUser,
    signInWithWhatsApp: async (_phoneNumber: string) => { },
    verifyCode: async (_code: string, _provider: "phone" | "whatsapp", _nextPage?: string) => { }
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

