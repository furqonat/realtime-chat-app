import { doc, getDoc } from "firebase/firestore";
import { IUser } from "interfaces";
import { useEffect, useState } from "react";
import { db } from "utils";


const useUserInfo = (props: { phoneNumber?: string }) => {
 
    const { phoneNumber } = props;
    const [userInfo, setUserInfo] = useState<IUser | null>(null)
 
    useEffect(() => {
       if (phoneNumber) {
           const docRef = doc(db, "users", phoneNumber);
           const unsubscribe = getDoc(docRef).then((doc) => {
               if (doc.exists()) {
                   setUserInfo(doc.data() as IUser)
               }
           })
           return () => unsubscribe
       } else {
           return () => {}
       }
    }, [phoneNumber])
 
    return { userInfo }
}

export { useUserInfo }
