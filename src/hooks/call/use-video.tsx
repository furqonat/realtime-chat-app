import { collection, onSnapshot } from "firebase/firestore"
import { IUser, ICall } from "interfaces"
import { useEffect, useState } from "react"
import { db } from "utils"


const useVideoCall = (props: {user?: IUser}) => {
    const [call, setCall] = useState<ICall>(null)
    const [calls, setCalls] = useState<ICall[]>([])

    useEffect(() => {
        const dbRef = collection(db, 'calls')
        const unsubscribe = onSnapshot(dbRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    // set call if doc is added and doc time is less than 2 minutes old
                    const data = change.doc.data()
                    if (data.time && new Date(data.time).getTime() > Date.now() - 120000 &&
                        data.callId.includes(props.user?.uid) &&
                        data.status === 'calling' &&
                        data.phoneNumber !== props.user?.phoneNumber) {
                        setCall(data as ICall)
                    }
                }
                if (change.type === "modified") {
                    const data = change.doc.data()
                    if (data.status === 'ended' && data.time && new Date(data.time).getTime() > Date.now() - 120000) {
                        setCall(null)
                    }
                }
            })
        })
        return unsubscribe
    }, [props.user?.uid, props.user?.phoneNumber])

    useEffect(() => {
        const dbRef = collection(db, 'calls')
        const unsubscribe = onSnapshot(dbRef, (snapshot) => {
            const callList = snapshot.docs.map((doc) => doc.data()).filter(data => data.callId.includes(props.user?.uid))
            setCalls(callList as ICall[])
            // console.log(callList)
            const value = []
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {

                    const data = change.doc.data()
                    if (data.callId.includes(props.user?.uid)) {
                        value.push(data)
                    }
                }
                if (change.type === "modified") {
                    const data = change.doc.data()
                    if (data.status === 'ended' && data.time && new Date(data.time).getTime() > Date.now() - 120000) {
                        setCalls([])
                    }
                }
            })
            setCalls(value.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()) as ICall[])
        })
        return unsubscribe
    }, [props.user?.uid])
    
    return {
        call,
        calls
    }
}

export { useVideoCall }
