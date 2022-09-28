import { Avatar, Box, Stack, Typography } from "@mui/material";
import { IChatMessage } from "interfaces";


const ChatList = (props: { chat: IChatMessage[], onClick?: (event: string) => void }) => {

    return (
        <Stack>
            {props.chat?.map((chats) => (
                <Item key={chats.time} chat={chats} onClick={(event: string) => props.onClick && props.onClick(event)} />
            ))}
        </Stack>
    )
}

const Item = (props: { chat: IChatMessage, onClick: (event: string) => void }) => {


    return (
        <Box
            onClick={() => {
                props.onClick(props.chat.receiver.phoneNumber)
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
                    }
                }}>
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{py: 2}}>
                <Avatar sx={{ width: 40, height: 40 }} />
                <Stack spacing={0} direction={'column'}>
                    <Typography variant={'body1'}>
                        {props.chat.sender.displayName ? props.chat.sender.displayName : props.chat.receiver.phoneNumber}
                    </Typography>
                    <Typography variant={'body2'}>
                        {props.chat.message.text}
                    </Typography>
                </Stack>
            </Stack>
            <Typography variant={'body2'}>{props.chat.time}</Typography>
        </Box>
    )
}

export { ChatList };
