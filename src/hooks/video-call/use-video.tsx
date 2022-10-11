import { collection, onSnapshot } from "firebase/firestore"
import { IUser, IVideoCall } from "interfaces"
import { useEffect, useState } from "react"
import { db } from "utils"


const useVideoCall = (props: {user: IUser}) => {
    const [call, setCall] = useState<IVideoCall>(null)
    const [calls, setCalls] = useState<IVideoCall[]>([])

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
                        setCall(data as IVideoCall)
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
    }, [props.user?.uid])
    return {
        call,
        calls
    }
}

export { useVideoCall }
