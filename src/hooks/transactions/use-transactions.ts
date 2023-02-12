import { collection, onSnapshot } from "firebase/firestore"
import { ITransactions } from "interfaces"
import { useEffect, useState } from "react"
import { db } from "utils"


const useTransactions = (props: { userId?: string }) => {

    const [transactions, setTransactions] = useState<ITransactions[] | null>(null)

    useEffect(() => {
        if (props?.userId) {
            const refs = collection(db, 'transactions')
            const subscribe = onSnapshot(refs, (snapshots) => {
                const value: ITransactions[] = []
                snapshots.docs.forEach((doc) => {

                    if (doc.data().id.includes(props?.userId)) {
                        value.push({ ...doc.data() as ITransactions, id: doc.id })
                    }
                })
                setTransactions(value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
            })
            return () => {
                subscribe()
            }
        } else {
            return () => { }
        }
    }, [props?.userId])

    return {
        transactions
    }

}

export { useTransactions }