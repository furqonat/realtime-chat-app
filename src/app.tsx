import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import "moment/locale/id";
import { About, EntryPoint, Privacy, SignIn, Verification, VerificationID, VideoCall } from 'pages';
import { useEffect, useState } from "react";
import { Route, Routes } from 'react-router-dom';
import { db, useFirebases } from "utils";
import { RoutePath } from './components';
import './index.css';
import { IUser } from "interfaces";

const initBeforeUnload = (user: IUser) => {
    window.onbeforeunload = (_event: BeforeUnloadEvent) => {
        const dbRef = query(collection(db, 'users'), where('phone', '==', user?.phoneNumber))
        getDocs(dbRef).then((snapshot) => {
            if (snapshot.empty) {
                return
            } else {
                snapshot.forEach((doc) => {
                    if (doc.exists()) {
                        updateDoc(doc.ref, {
                            status: new Date().toISOString()
                        }).then(r => { })
                    }
                })
            }
        })
        // updateDoc(dbRef, {
        //     status: new Date().toISOString()
        // }).then(r => { })
    }
}

const App = () => {


    const { user } = useFirebases()
    const [online, setOnline] = useState(document.visibilityState === 'visible')

    window.onload = () => {
        initBeforeUnload(user)
    }

    useEffect(() => {
        initBeforeUnload(user)
    }, [user])

    useEffect(() => {
        if (user?.uid) {
            const collectionRef = query(collection(db, 'users'), where('uid', '==', user.uid))
            getDocs(collectionRef).then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (doc.exists()) {
                        updateDoc(doc.ref, {
                            status: online ? 'online' : new Date().toISOString()
                        })
                    }
                })
            })
            return () => {
                getDocs(collectionRef).then((snapshot) => {
                    snapshot.forEach((doc) => {
                        if (doc.exists() && doc.data().uid === user.uid) {
                            updateDoc(doc.ref, {
                                status: new Date().toISOString()
                            })
                        }
                    })
                })
            }
        }
        return () => { }
    }, [user?.uid, online])

    useEffect(() => {
        const handler = () => setOnline(document.visibilityState === 'visible')
        document.addEventListener('visibilitychange', handler)
        return () => document.removeEventListener('visibilitychange', handler)
    }, [])


    return (
        <Routes>
            <Route index element={<SignIn />} />
            <Route path={RoutePath.INDEX} element={<EntryPoint />} />
            <Route path={RoutePath.VERIFY} element={<Verification />} />
            <Route path={RoutePath.VIDEO_CALL} element={<VideoCall />} />
            <Route path={RoutePath.VERIFICATION} element={<VerificationID />} />
            <Route path={RoutePath.ABOUT} element={<About />} />
            <Route path={RoutePath.PRIVACY} element={<Privacy />} />
        </Routes>
    )
}

export default App