import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import "moment/locale/id";
import { useEffect } from "react";
import { Route, Routes } from 'react-router-dom';
import { db, useFirebases } from "utils";
import { RoutePath } from './components/utils';
import './index.css';
import { EntryPoint, SignInQr, Verification } from './pages';

const App = () => {
    

    const {user} = useFirebases()

    useEffect(() => {
        if (user?.phoneNumber) {
            const dbRef = doc(db, 'users', user.phoneNumber)
            updateDoc(dbRef, {
                status: document.visibilityState === 'visible' ? 'online' : new Date().toISOString()
            })
        }

    }, [user?.phoneNumber])


    
    return (
        <Routes>
            <Route index element={<SignInQr />} />
            <Route path={RoutePath.INDEX} element={<EntryPoint />} />
            <Route path={RoutePath.VERIFY} element={<Verification/>} />
        </Routes>
    )
}

export default App