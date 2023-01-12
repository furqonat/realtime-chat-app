import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "utils";


const useUserStatus = (props: {uid: string}) => {

    const [status, setStatus] = useState("")

    useEffect(() => {
        const dbRef = doc(db, "users", props.uid)
        const unsubscribe = onSnapshot(dbRef, (doc) => {
            setStatus(doc.data()?.status)
        })
        return unsubscribe
    }, [props.uid])

    return {
        status
    }
}

export { useUserStatus };
