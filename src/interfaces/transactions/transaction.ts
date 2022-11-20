import { IContact } from "interfaces";

interface TransactionObject {
    transactionType: string,
    transactionAmount: number,
    transactionStatus: string,
    transactionFee: number,
    transactionName: string,
    receiverInfo: IContact
}

interface ITransactions extends TransactionObject {
    id: string,
    senderUid: string,
    senderPhoneNumber: string,
    receiverUid: string,
    receiverPhoneNumber: string,
    createdAt: string,
    status: string,
    transactionToken?: {
        redirect_url: string,
        token: string
    } | null,
    payment_type?: string | null,
}
export { TransactionObject, ITransactions }