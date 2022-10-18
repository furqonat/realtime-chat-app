import { doc, getDoc } from "firebase/firestore";
import { IUser } from "interfaces";
import { useEffect, useState } from "react";
import { db } from "utils";


const useUserInfo = (props: { phoneNumber: string }) => {
 
    const { phoneNumber } = props;
    const [userInfo, setUserInfo] = useState<IUser | null>(null)
 
    useEffect(() => {
        const userDoc = doc(db, "users", phoneNumber)
        getDoc(userDoc).then((doc) => {
            if (doc.exists()) {
                setUserInfo(doc.data() as IUser)
            } else {
                throw new Error("No such document!")
            }
        })
    }, [phoneNumber])
 
    return { userInfo }
}

export { useUserInfo };
