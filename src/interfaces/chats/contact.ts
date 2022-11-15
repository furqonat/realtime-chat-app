import { IUser } from "interfaces"

type IContact = Pick<IUser, "displayName" | "uid" | "phoneNumber" | "email">

export { IContact }