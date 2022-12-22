import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore'
import { IContact, IUser } from 'interfaces'
import { useEffect, useState } from 'react'
import { db } from 'utils'

const useContact = (props: { contactId?: string, user: IUser }) => {
    const [contact, setContact] = useState<IContact | null>(null)

    useEffect(() => {
        if (props?.contactId) {
            const docRef = doc(db, 'users', props.user.phoneNumber, 'contacts', props.contactId)
            const unsubscribe = onSnapshot(docRef, (snapshot) => {
                if (snapshot.exists()) {
                    setContact(snapshot.data() as IContact)
                } else {
                    setContact(null)
                }
            })
            return () => unsubscribe()
        }
        return () => { }
    }, [props?.contactId, props.user])

    const saveContact = async ( contact: IContact ) => {
        const docRef = doc(db, 'users', props.user.phoneNumber, 'contacts', contact.uid)
        return setDoc(docRef, contact, { merge: true })
    }

    return {
        contact,
        saveContact
    }

}

const useContacts = (props: { user: IUser }) => {
    const [contacts, setContacts] = useState<IContact[]>([])

    useEffect(() => {
        const collectionRef = collection(db, 'users', props.user.phoneNumber, 'contacts')
        const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
            const contactList: IContact[] = []
            snapshot.forEach((doc) => {
                contactList.push(doc.data() as IContact)
            })
            setContacts(contactList)
        })
        return () => unsubscribe()
    }, [props.user.phoneNumber])

    return {
        contacts
    }
}
export { useContact, useContacts }