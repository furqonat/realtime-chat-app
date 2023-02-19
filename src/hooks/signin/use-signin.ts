import { uuidv4 } from "@firebase/util";
import { useState } from "react";

const useSignIn = () => {

    const [verificationId] = useState<string>(uuidv4())




    /*useEffect(() => {
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
                        console.log("modified")
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

    }, [verificationId, signIn])*/

    return {
        verificationId,
    }
}

export { useSignIn }

