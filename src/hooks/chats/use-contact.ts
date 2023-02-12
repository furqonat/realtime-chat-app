import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { IContact, IUser } from 'interfaces'
import { useEffect, useState } from 'react'
import { db } from 'utils'

const useContact = (props: { contactId?: string, user: IUser }) => {
    const [contact, setContact] = useState<IContact | null>(null)

    useEffect(() => {
        if (props?.contactId) {
            // const docRef = doc(db, 'users', props.user.uid, 'contacts', props.contactId)
            const queryRef = query(collection(db, 'users'), where('uid', '==', props.user.uid))
            const unsubscribe = onSnapshot(queryRef, (snapshot) => {
                if (snapshot.empty) {
                    setContact(null)
                } else {
                    snapshot.forEach((docs) => {
                        if (docs.exists()) {
                            // const contactList: IContact[] = docs.data().contacts
                            const contactRef = doc(db, 'users', docs.id, 'contacts', props.contactId)
                            // const contact = contactList.find((contact) => contact.uid === props.contactId)
                            getDoc(contactRef).then((doc) => {
                                if (doc.exists()) {
                                    setContact(doc.data() as IContact)
                                } else {
                                    setContact(null)
                                }
                            })
                            // setContact(contact)
                        } else {
                            setContact(null)
                        }
                    })
                }
            })
            // const unsubscribe = onSnapshot(docRef, (snapshot) => {
            //     if (snapshot.exists()) {
            //         setContact(snapshot.data() as IContact)
            //     } else {
            //         setContact(null)
            //     }
            // })
            return () => unsubscribe()
        }
        return () => { }
    }, [props?.contactId, props.user])

    const saveContact = async (contact: IContact) => {
        // const docRef = doc(db, 'users', props.user.uid, 'contacts', contact.uid)
        return new Promise(async (resolve, reject) => {

            const queryRef = query(collection(db, 'users'), where('uid', '==', props.user.uid))
            const snapshot = await getDocs(queryRef)
            if (snapshot.empty) {
                reject()
            }
            snapshot.forEach((docs) => {
                if (docs.exists()) {
                    const docRef = doc(db, 'users', docs.id, 'contacts', contact.uid)
                    setDoc(docRef, contact, { merge: true }).then(() => {
                        resolve(true)
                    }).catch(() => {
                        reject()
                    })
                } else {
                    reject()
                }
            })
        })
    }

    return {
        contact,
        saveContact
    }

}

const useContacts = (props: { user: IUser }) => {
    const [contacts, setContacts] = useState<IContact[]>([])

    useEffect(() => {
        const collectionRef = collection(db, 'users')
        const queryRef = query(collectionRef, where('phoneNumber', '==', props.user.phoneNumber))
        const unsubscribe = onSnapshot(queryRef, (snapshot) => {
            const contactList: IContact[] = []
            snapshot.forEach((user) => {
                const ref = collection(db, 'users', user.id, 'contacts')
                getDocs(ref).then((snapshot) => {
                    snapshot.forEach((doc) => {
                        contactList.push(doc.data() as IContact)
                    })
                })
            })
            setContacts(contactList)
        })
        return () => unsubscribe()
    }, [props.user.uid])

    return {
        contacts
    }
}
export { useContact, useContacts }