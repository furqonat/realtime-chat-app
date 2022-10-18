interface IUser {
    uid: string,
    displayName?: string | null,
    photoURL?: string | null,
    phoneNumber: string | null,
    isIDCardVerified?: boolean | null
}
export { IUser }