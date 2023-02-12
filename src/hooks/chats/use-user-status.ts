import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "utils";


const useUserStatus = (props: { uid: string }) => {

    const [status, setStatus] = useState("")

    useEffect(() => {
        const dbRef = query(collection(db, "users"), where("uid", "==", props.uid))
        const unsubscribe = onSnapshot(dbRef, (doc) => {
            // setStatus(doc.data()?.status)
            if (doc.empty) {
                setStatus("")
            } else {
                doc.forEach((doc) => {
                    if (doc.exists()) {
                        setStatus(doc.data()?.status)
                    } else {
                        setStatus("")
                    }
                })
            }
        })
        return unsubscribe
    }, [props.uid])

    return {
        status
    }
}

export { useUserStatus };
