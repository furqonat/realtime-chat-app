import { uuidv4 } from "@firebase/util";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, useFirebases } from "utils";

const useSignIn = () => {

    const [verificationId] = useState<string>(uuidv4())
    const [token, setToken] = useState<string>('')

    const { signIn } = useFirebases()
    

    useEffect(() => {
        const unsubscribe = () => {
            const docRef = collection(db, "signin")
            onSnapshot(docRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        if (change.doc.id === verificationId) {
                            setToken(change.doc.data().token)
                            signIn(change.doc.data().token).then(() => {
                                console.log("signed in")
                            })
                        }
                    } else if (change.type === "modified") {
                        if (change.doc.id === verificationId) {
                            setToken(change.doc.data().token)
                            signIn(change.doc.data().token).then(() => {
                                console.log("signed in")
                            })
                        }
                    } else if (change.type === "removed") {
                        setToken('')
                    }
                })
            })
        }
        return () => {
            unsubscribe()
        }

    }, [verificationId, signIn])

    return {
        verificationId,
        token
    }
}

export { useSignIn }

