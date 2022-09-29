import { collection, onSnapshot } from "firebase/firestore";
import { IChatList, IChatMessage, IUser } from "interfaces";
import { useEffect, useState } from "react";
import { db } from "utils";
import newChatSound from "assets/sounds/new-chats.wav";


const useChats = (props: { id?: string, user: IUser }) => {

    const [chatList, setChatList] = useState<IChatList[]>([])
    const [messages, setMessages] = useState<IChatMessage[]>([])

    useEffect(() => {

        const col = collection(db, 'chats')
        const chatSubscribe =
            onSnapshot(col, (snapshot) => {
                const values: any = []
                snapshot.forEach((doc) => {
                    const data = doc.data()
                    if (data.users.includes(props.user.uid)) {
                        values.push(data)
                    }
                    setChatList(values
                        .sort((a: any, b: any) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()))
                })
            })
        return () =>
            chatSubscribe()
    }, [props.user?.uid])

    useEffect(() => {
        let unsubscribe: any = () => { }
        if (props.id) {
            const messageRef = collection(db, "chats", props?.id, "messages")
            unsubscribe =
                onSnapshot(messageRef, snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === "added") {
                            // play sound when new message is added and user is not in chat screen 
                            if (document.visibilityState === "hidden" && props.user.uid !== change.doc.data().sender.uid) {
                                const audio = new Audio(newChatSound)
                                audio.play()
                            }
                            // play sound if message is not from current user and read status is false and message is less than 5 second old
                            // if (change.doc.data().sender.uid !== props.user.uid && !change.doc.data().read && new Date().getTime() - new Date(change.doc.data().time).getTime() < 5000) {
                            //     new Audio(newChatSound).play()
                            // }
                        }
                    })
                    const data = snapshot.docs
                        .map(doc => doc.data())
                    const orderedData = data.sort((a: any, b: any) => {
                        return new Date(b.message.createdAt).getTime() - new Date(a.message.createdAt).getTime()
                    })
                    setMessages(orderedData as IChatMessage[])
                })
        }
        return () => {
            unsubscribe()
        }
    }, [props.id])

    return { chatList, messages }
}

export { useChats };
