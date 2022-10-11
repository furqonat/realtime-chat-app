interface IVideoCall {
    displayName: string,
    callId: string,
    callType: string,
    phoneNumber: string,
    status: string,
    photoURL: string,
    time: string,
    seen: boolean,
}

export { IVideoCall }