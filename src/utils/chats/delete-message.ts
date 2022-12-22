import { doc, getDoc, updateDoc } from "firebase/firestore";
import { IChatItem, IUser } from "interfaces";
import { db } from "utils/firebase";

const deleteMessage = async (props: {
    id: string,
    messageId: string,
    user: IUser,
    receiver: IChatItem,
}): Promise<void> => {
    const docRef = doc(db, 'chats', props.id, 'messages', props.messageId)
    return updateDoc(docRef, {
        visibility: {
            [props.user.uid]: false,
            [props.receiver.uid]: await getDoc(docRef).then((doc) => doc.data().visibility[props.receiver.uid])
        }
    })
}

const deleteMessages = async (props: {
    id: string,
    user: IUser,
    receiver: IChatItem,
}): Promise<void> => {
    const docRef = doc(db, 'chats', props.id, 'messages')
    return updateDoc(docRef, {
        visibility: {
            [props.user.uid]: false,
            [props.receiver.uid]: await getDoc(docRef).then((doc) => doc.data().visibility[props.receiver.uid])
        }
    })
}


export { deleteMessage, deleteMessages }