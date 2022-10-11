import { doc, updateDoc } from "firebase/firestore";
import "moment/locale/id";
import { SignIn } from "pages/mobile";
import { useEffect, useState } from "react";
import { Route, Routes } from 'react-router-dom';
import { db, useFirebases } from "utils";
import { RoutePath } from './components/utils';
import './index.css';
import { EntryPoint, SignInQr, Verification, VideoCall } from 'pages';

const App = () => {
    

    const { user } = useFirebases()
    const [online, setOnline] = useState(document.visibilityState === 'visible')


    useEffect(() => {
        if (user?.phoneNumber) {
            const dbRef = doc(db, 'users', user.phoneNumber)
            updateDoc(dbRef, {
                status: online ? 'online' : new Date().toISOString()
            })
        }


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
        </Routes>
    )
}

export default App