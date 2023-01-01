import { doc, getDoc } from "firebase/firestore";
import { IUser } from "interfaces";
import { useEffect, useState } from "react";
import { db } from "utils";


const useUserInfo = (props: { uid?: string }) => {

    const { uid } = props;
    const [userInfo, setUserInfo] = useState<IUser | null>(null)

    useEffect(() => {
        if (uid) {
            const docRef = doc(db, "users", uid);
            const unsubscribe = getDoc(docRef).then((doc) => {
                if (doc.exists()) {
                    setUserInfo(doc.data() as IUser)
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
