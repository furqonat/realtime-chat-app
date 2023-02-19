import { collection, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
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
        const dbRef = query(collection(db, 'users'), where('phoneNumber', '==', user?.phoneNumber))
        getDocs(dbRef).then((snapshot) => {
            if (snapshot.empty) {
                return
            } else {
                snapshot.forEach((doc) => {
                    if (doc.exists()) {
                        updateDoc(doc.ref, {
                            status: new Date().toISOString()
                        }).then(r => {
                        })
                    }
                })
            }
        })
        // updateDoc(dbRef, {
        //     status: new Date().toISOString()
        // }).then(r => { })
    }
}

const bc = new BroadcastChannel('messaging-channel');

const App = () => {


    const {user} = useFirebases()
    const [online, setOnline] = useState(document.visibilityState === 'visible')

    window.onload = () => {
        initBeforeUnload(user)
    }

    useEffect(() => {
        initBeforeUnload(user)
    }, [user])

    useEffect(() => {
        if (user?.phoneNumber) {
            const collectionRef = query(collection(db, 'users'), where('phoneNumber', '==', user.phoneNumber))
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
        return () => {
        }
    }, [user?.phoneNumber, online])

    useEffect(() => {
        const handler = () => setOnline(document.visibilityState === 'visible')
        document.addEventListener('visibilitychange', handler)
        return () => document.removeEventListener('visibilitychange', handler)
    }, [])

    // send message to service worker
    useEffect(() => {
        // request permission notification
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                bc.postMessage('Hello world!');
            } else {
                console.log('Permission denied')
            }
        })
    }, [])

    useEffect(() => {
        if (user?.phoneNumber) {
            const unsubscribe = onSnapshot(collection(db, 'chats'), (snapshot) => {
                if (snapshot.empty) {
                    return
                }
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        onSnapshot(collection(db, 'chats', change.doc.id, 'messages'), (data) => {
                            data.docChanges().forEach((ch) => {
                                if (change.type === "added") {
                                    console.log(ch.doc.data())
                                    const phoneNumber = ch.doc.data().receiver.phoneNumber
                                    // display notification when new message is added and user is not in chat screen
                                    console.log(phoneNumber, user?.phoneNumber)
                                    if (user?.phoneNumber === phoneNumber) {
                                        console.log("new message", ch.doc.data().message.text)
                                        const notification = new Notification(ch.doc.data().sender.displayName, {
                                            body: ch.doc.data().message.text,
                                            icon: ch.doc.data().sender.photoURL,
                                            tag: ch.doc.data().sender.uid
                                        })
                                        notification.onclick = () => {
                                            window.focus()
                                        }
                                    }
                                    // play sound when new message is added and user is not in chat screen
                                }
                            })
                        })
                    }
                    if (change.type === 'modified') {
                        onSnapshot(collection(db, 'chats', change.doc.id, 'messages'), (data) => {
                            data.docChanges().forEach((ch) => {
                                if (change.type === "added") {
                                    const phoneNumber = ch.doc.data().receiver.phoneNumber
                                    // display notification when new message is added and user is not in chat screen
                                    if (user?.phoneNumber === phoneNumber) {
                                        console.log("new message", ch.doc.data().message.text)
                                        const notification = new Notification("New message", {
                                            body: ch.doc.data().message.text,
                                            icon: ch.doc.data().sender.photoURL,
                                            tag: ch.doc.data().sender.uid
                                        })
                                        notification.onclick = () => {
                                            window.focus()
                                        }
                                    }
                                    // play sound when new message is added and user is not in chat screen
                                }
                            })
                        })
                    }
                })
            })
            return () => unsubscribe()
        } else {
            return () => {
            }
        }
    }, [user?.phoneNumber])
    return (
        <Routes>
            <Route index element={<SignIn/>}/>
            <Route path={RoutePath.INDEX} element={<EntryPoint/>}/>
            <Route path={RoutePath.VERIFY} element={<Verification/>}/>
            <Route path={RoutePath.VIDEO_CALL} element={<VideoCall/>}/>
            <Route path={RoutePath.VERIFICATION} element={<VerificationID/>}/>
            <Route path={RoutePath.ABOUT} element={<About/>}/>
            <Route path={RoutePath.PRIVACY} element={<Privacy/>}/>
        </Routes>
    )
}

export default App