import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "utils";


const useUserStatus = (props: {phoneNumber: string}) => {

    const [status, setStatus] = useState("")

    useEffect(() => {
        const dbRef = doc(db, "users", props.phoneNumber)
        const unsubscribe = onSnapshot(dbRef, (doc) => {
            setStatus(doc.data()?.status)
        })
        return unsubscribe
    }, [props.phoneNumber])

    return {
        status
    }
}

export { useUserStatus };
