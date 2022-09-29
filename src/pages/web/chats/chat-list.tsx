import { Avatar, Box, Stack, Typography } from "@mui/material";
import { IChatList } from "interfaces";
import moment from "moment";
import { useState } from "react";
import { useFirebases } from "utils";


const ChatList = (props: { chat: IChatList[], onClick?: (event: string) => void }) => {

    const [activeChat, setActiveChat] = useState<string>("")

    return (
        <Stack>
            {
                props.chat?.map((chats) => (
                    <Item
                        key={chats.receiver.uid}
                        activeChat={activeChat === chats.receiver.uid}
                        chat={chats}
                        onSelect={(event) => {
                            setActiveChat(event)
                        }}
                        onClick={(event: string) => {
                            props.onClick && props.onClick(event)
                        }} />
                ))
            }
        </Stack>
    )
}


const Item = (props: { chat: IChatList, onClick: (event: string) => void, activeChat: boolean, onSelect: (owner: string) => void }) => {

    const { user } = useFirebases()
    const getOwnerDisplayNameOrPhoneNumber = () => {
        if (props.chat.owner === user.uid) {
            if (props.chat.receiver.displayName) {
                return props.chat.receiver.displayName
            }
            return props.chat.receiver.phoneNumber
        }
        return props.chat.ownerDisplayName || props.chat.ownerPhoneNumber
    }

    return (
        <Box
            onClick={() => {
                user && props.onClick(user.uid === props.chat.owner ? props.chat.receiver.phoneNumber : props.chat.ownerPhoneNumber)
                props.onSelect && props.onSelect(props.chat.receiver.uid)
            }}
            sx={
                {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2, px: 2, justifyContent: 'space-between',
                    '&:hover': {
                        background: '#f3f5f7',
                        cursor: 'pointer'
                    },
                    ...(props.activeChat ? {
                        background: '#f3f5f7',
                    } : {
                        background: 'white',
                    })
                }}>
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{py: 2}}>
                <Avatar sx={{ width: 40, height: 40 }} />
                <Stack spacing={0} direction={'column'}>
                    <Typography variant={'body1'}>
                        {
                            getOwnerDisplayNameOrPhoneNumber()
                        }
                    </Typography>
                    <Typography variant={'body2'}>
                        {props.chat.lastMessage?.text}
                    </Typography>
                </Stack>
            </Stack>
            <Typography variant={'body2'}>{moment(props.chat.lastMessage?.createdAt).locale('id').fromNow()}</Typography>
        </Box>
    )
}

export { ChatList };
