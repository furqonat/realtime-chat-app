import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { IUser } from "interfaces";
import { useEffect, useState } from "react";
import { db } from "utils";


const useUserInfo = (props: { uid?: string }) => {

    const { uid } = props;
    const [userInfo, setUserInfo] = useState<IUser | null>(null)

    useEffect(() => {
        if (uid) {
            const docRef = query(collection(db, "users"), where("uid", "==", uid))
            const unsubscribe = getDocs(docRef).then((doc) => {
                if (doc.empty) {
                    setUserInfo(null)
                } else {
                    doc.forEach((doc) => {
                        if (doc.exists()) {
                            setUserInfo(doc.data() as IUser)
                        } else {
                            setUserInfo(null)
                        }
                    })
                }
            })
            return () => unsubscribe
        } else {
            return () => { }
        }
    }, [uid])

    return { userInfo }
}

export { useUserInfo }
