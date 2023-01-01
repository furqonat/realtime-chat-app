import { doc, updateDoc } from "firebase/firestore";
import "moment/locale/id";
import { About, EntryPoint, Privacy, SignIn, Verification, VerificationID, VideoCall } from 'pages';
import { useEffect, useState } from "react";
import { Route, Routes } from 'react-router-dom';
import { db, useFirebases } from "utils";
import { RoutePath } from './components/utils';
import './index.css';

const initBeforeUnload = (user) => {
    window.onbeforeunload = (_event: BeforeUnloadEvent) => {
        const dbRef = doc(db, 'users', user.phoneNumber)
        updateDoc(dbRef, {
            status: new Date().toISOString()
        })
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
        if (user?.phoneNumber) {
            const dbRef = doc(db, 'users', user.phoneNumber)
            updateDoc(dbRef, {
                status: online ? 'online' : new Date().toISOString()
            })
            return () => {
                updateDoc(dbRef, {
                    status: new Date().toISOString()
                })
            }
        }
        return () => { }
    }, [user?.phoneNumber, online])

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