import { collection, onSnapshot } from "firebase/firestore";
import { IChatMessage, IUser } from "interfaces";
import { useEffect, useState } from "react";
import { db } from "utils";


const useChats = (props: {user: IUser}) => {

    const [chatList, setChatList] = useState<IChatMessage[]>([])
    const [messages, setMessages] = useState<IChatMessage[]>([])
    
    useEffect(() => {
        const subscribe = () => {
            const messageRef = collection(db, "chats")
            onSnapshot(messageRef, snapshot => {
                const value = snapshot.docs
                    .filter(doc => doc.data().sender.uid === props.user.uid || doc.data().receiver.uid === props.user.uid)
                    .map(doc => doc.data())
                    .sort((a: any, b: any) => new Date(b.message.createdAt).getTime() - new Date(a.message.createdAt).getTime()) as IChatMessage[]
                const unique = value.filter((v, i, a) => a.findIndex(t => (t.sender.uid === v.sender.uid && t.receiver.uid === v.receiver.uid) || (t.sender.uid === v.receiver.uid && t.receiver.uid === v.sender.uid)) === i)
                setChatList(unique)
            })
            onSnapshot(messageRef, snapshot => {
                const data = snapshot.docs.map(doc => doc.data())
                // order data by time
                const orderedData = data.sort((a: any, b: any) => {
                    return new Date(a.message.createdAt).getTime() - new Date(b.message.createdAt).getTime()
                })
                setMessages(orderedData as IChatMessage[])
            })
        }
        return subscribe()
    }, [])
    
    return { chatList, messages }
}

export { useChats }