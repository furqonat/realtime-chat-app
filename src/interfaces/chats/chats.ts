import { IUser } from "interfaces";

interface IChatItem extends IUser {
    lastLogin?: any,
    status: "online" | "typing" | string,
}

interface IChatMessage {
    id?: string,
    message: {
        text: string,
        createdAt: string,
    },
    time: string,
    sender: {
        uid: string,
        displayName: string,
        phoneNumber: string,
    },
    receiver: {
        uid: string,
        displayName: string,
        phoneNumber: string,
    },
    type: string,
    read: boolean,
    visibility: {
        [key: string]: boolean,
    },
}


interface IChatList {
    id: string,
    owner: string,
    receiver: {
        uid: string,
        displayName: string,
        phoneNumber: string,
        photoURL: string,
        status: string | "online" | "typing",
    },
    lastMessage?: {
        text: string,
        createdAt: string,
    } | null,
    ownerPhoneNumber: string,
    ownerDisplayName: string,
    status: string | "online" | "typing",
}

export { IChatItem, IChatMessage, IChatList }