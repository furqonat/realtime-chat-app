import { Card, Stack, Avatar, Typography } from "@mui/material"
import { useUserStatus } from "hooks"
import { IContact } from "interfaces"
import moment from "moment"

const ContactList = (props: { contact: IContact, onClick?: (contact: IContact) => void }) => {

    const { status } = useUserStatus({ phoneNumber: props?.contact.phoneNumber })

    return (
        <Card
            onClick={() => props.onClick && props.onClick(props.contact)}
            sx={{
                p: 2,
                '&:hover': {
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer'
                }
            }}
            variant={'outlined'}>
            <Stack
                spacing={1}
                direction={'column'}>
                <Stack
                    spacing={2}
                    alignItems={'center'}
                    direction={'row'}>
                    <Avatar
                        sx={{
                            width: 50,
                            height: 50
                        }} />
                    <Stack
                        direction={'column'}>
                        <Typography variant={'body1'}>{props?.contact?.displayName}</Typography>
                        <Typography variant={'body2'}>{
                            status === 'online' ? 'Online' : moment(status).fromNow()
                        }</Typography>
                    </Stack>

                </Stack>
            </Stack>
        </Card>
    )
}

export { ContactList }