interface ICall {
    displayName: string,
    callId: string,
    callType: string,
    phoneNumber: string,
    status: string,
    photoURL: string,
    time: string,
    seen: boolean,
    caller: {
        uid: string,
        displayName?: string,
        phoneNumber: string,
        photoURL?: string
    },
    receiver: {
        uid: string,
        displayName?: string,
        phoneNumber: string,
        photoURL?: string
    }
}

export { ICall }