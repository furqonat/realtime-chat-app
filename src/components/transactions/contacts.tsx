import { AddOutlined } from "@mui/icons-material"
import { Button, IconButton, Modal, Stack, Typography } from "@mui/material"
import { useContacts } from "hooks"
import { IContact } from "interfaces"
import { useState } from "react"
import { useFirebases } from "utils"
import { ContactList } from "./contact-list"
import { TransactionInfo } from "./transaction-info"

interface IContactsProps {
    open: boolean,
    onClose: () => void
}

// TODO: add new modal for new contact

const Contacts: React.FC<IContactsProps> = (props) => {
    const { open = false, onClose } = props

    const { user } = useFirebases()
    const { contacts } = useContacts({
        user: user
    })

    const [selectedUser, setSelectedUser] = useState<IContact | null>(null)
    const [indexView, setIndexView] = useState(1)

    const handleOnContactClick = (contact: IContact) => {
        setSelectedUser(contact)
        setIndexView(indexView + 1)
    }

    return (
        <Modal
            aria-labelledby={"modal-modal-title"}
            aria-describedby={"modal-modal-description"}
            onClose={onClose}
            open={open}>
            <Stack
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60%',
                    bgcolor: 'background.paper',
                    p: 3,
                    borderRadius: 2,
                    height: '80%'
                }}
                direction={'column'}
                spacing={2}>
                <Stack
                    sx={{
                        display: 'flex',
                    }}
                    direction={'row'}
                    justifyContent={'space-between'}>
                    <Typography variant={'h5'}>{
                        indexView === 1 ? "Pilih Kontak" : "Lengkapi Informasi"
                    }</Typography>
                    <IconButton>
                        <AddOutlined />
                    </IconButton>
                </Stack>
                <Stack
                    direction={'column'}
                    sx={{
                        overflowY: 'auto',
                        height: '100%',
                        display: 'flex',
                        flex: 1
                    }}>
                    {
                        indexView === 1 && (
                            contacts?.map((contact, index) => {

                                return (
                                    <ContactList
                                        key={index}
                                        contact={contact}
                                        onClick={handleOnContactClick} />
                                )
                            })
                        )
                    }
                    {
                        indexView === 2 && (
                            <TransactionInfo
                                contact={selectedUser} />
                        )
                    }
                </Stack>
                <Stack
                    spacing={2}
                    direction={'row-reverse'}>
                    <Button
                        disabled={!selectedUser}
                        variant={'contained'}>
                        Next
                    </Button>
                    {
                        indexView > 1 && (
                            <Button
                                onClick={() => setIndexView(indexView - 1)}
                                variant={'contained'}>
                                Back
                            </Button>
                        )
                    }
                </Stack>
            </Stack>
        </Modal>
    )
}


export { Contacts }

