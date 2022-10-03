import { Avatar, Box, Card, Stack, Typography } from "@mui/material";
import { useChats } from "hooks";
import { IChatItem } from "interfaces";
import moment from "moment";
import { useEffect, useRef } from "react";
import { useFirebases } from "utils";
import { ChatInput } from "./chat-input";

const ChatItem = (props: {user: IChatItem}) => {


    const ref = useRef<HTMLDivElement>(null)
    const { user } = useFirebases()
    
    const id = user.uid > props.user.uid ? user.uid + props.user.uid : props.user.uid + user.uid
    const { messages } = useChats({ id: id, user: user })

   
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])
    return (
        <Box
            component={'section'}
            sx={{
            width: '100%',
            display: 'flex',
            height: 'calc(100vh)',
            gap: 2,
            flexFlow: 'column wrap',
            justifyContent: 'space-between'
        }}>
            <Stack
                component={'header'}
                sx={{
                    display: 'flex'
                }}
                spacing={2}>
                <Card
                    variant={'outlined'}
                    sx={{
                        width: '100%',
                        px: 2,
                        background: '#f3f5f7',
                    }}>
                    <Stack spacing={2} direction={'row'} sx={{ p: 1 }}>
                        <Avatar
                            sx={{ width: 40, height: 40 }} />
                        <Stack spacing={0} direction={'column'}>
                            <Typography variant={'body1'}>{
                                props.user.displayName ? props.user.displayName : props.user.phoneNumber
                            }</Typography>
                            <Typography variant={'body2'}>
                                {
                                    // get status of user
                                    props.user.status === 'online' ? 'online' : moment(props.user.status).fromNow()
                                }
                            </Typography>
                        </Stack>
                    </Stack>
                </Card>
            </Stack>
            <Stack
                component={'main'}
                sx={{
                    display: 'flex',
                    flex: 1,
                    overflowY: 'scroll',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },
                    flexDirection: 'column-reverse',
                }}>
                <div ref={ref}></div>
                {
                    messages.map((item, index) => {
                        return (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    m: 1,
                                    flexDirection: item.sender.uid === user.uid ? 'row-reverse' : 'row',
                                }}>
                                <Stack spacing={2} direction={'row'} sx={{
                                    p: 1,
                                    boxShadow: 1,
                                    background: item.sender.uid === user.uid ? '#1a237e' : '#fff',
                                    borderRadius: item.sender.uid === user.uid ? '10px 10px 0 10px' : '10px 10px 10px 0',
                                }}>
                                    <Avatar
                                        sx={{ width: 40, height: 40 }} />
                                    <Stack spacing={0} direction={'column'}>
                                        {
                                            item.type === 'text' ? (
                                                <Typography
                                                variant={'body1'}
                                                sx={{
                                                    color: item.sender.uid === user.uid ? '#fff' : '#000'
                                                }}>
                                                {
                                                    item.message.text
                                                }
                                            </Typography>
                                            ) : (
                                                    <audio
                                                        key={index + '2'}
                                                        src={item.message.text}
                                                        controls>
                                                    </audio>
                                            )
                                        }
                                        <Typography
                                            sx={{
                                                color: item.sender.uid === user.uid ? '#fff' : '#000'
                                            }}
                                            variant={'body2'}>{
                                                moment(item.message.createdAt).locale('id').fromNow()
                                            }</Typography>
                                    </Stack>
                                </Stack>
                            </Box>
                        )
                    })
                }

            </Stack>
            <ChatInput
                user={props.user}/>
        </Box>
    )
}

export { ChatItem };
