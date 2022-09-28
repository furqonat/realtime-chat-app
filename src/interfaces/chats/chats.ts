interface IChatItem {
    uid: string,
    phoneNumber: string,
    displayName?: string,
    isIDCardVerified: boolean,
    photoURL?: string,
    lastLogin?: any
}

interface IChatMessage {
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
}

export { IChatItem, IChatMessage }