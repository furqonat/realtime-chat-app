import { AttachFileOutlined, EmojiEmotionsOutlined, SendOutlined } from "@mui/icons-material";
import { Avatar, Box, Card, IconButton, OutlinedInput, Stack, Typography } from "@mui/material";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { IChatItem, IChatMessage } from "interfaces";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { db, useFirebases } from "utils";

const ChatItem = (props: {user: IChatItem}) => {


    console.log(moment.locales())
    const ref = useRef<Element>(null)
    const [chatMessage, setChatMessage] = useState<IChatMessage[]>([])
    const [message, setMessage] = useState('')
    const { user } = useFirebases()
    
    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const dbRef = collection(db, 'chats')
            addDoc(dbRef, {
                time: new Date().toLocaleTimeString(),
                message: {
                    text: message,
                    createdAt: new Date().toISOString(),
                },
                sender: {
                    uid: user.uid,
                    displayName: user.displayName,
                    phoneNumber: user.phoneNumber,
                },
                receiver: {
                    uid: props.user.uid,
                    displayName: props.user.displayName,
                    phoneNumber: props.user.phoneNumber,
                }
            })
            setMessage('')
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setMessage(event.target.value)
    }


    useEffect(() => {
        const dbRef = collection(db, 'chats')
        const subscribe = onSnapshot(dbRef, snapshot => {
            const data = snapshot.docs.map(doc => doc.data())
            // order data by time
            const orderedData = data.sort((a: any, b: any) => {
                return new Date(a.message.createdAt).getTime() - new Date(b.message.createdAt).getTime()
            })
            setChatMessage(orderedData as IChatMessage[])
        })
        return () => subscribe()

    }, [])
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
                    <Stack spacing={2} direction={'row'} sx={{p: 1}}>
                        <Avatar
                            sx={{ width: 40, height: 40 }}/>
                        <Stack spacing={0} direction={'column'}>
                            <Typography variant={'body1'}>{
                                props.user.displayName ? props.user.displayName : props.user.phoneNumber
                            }</Typography>
                            <Typography variant={'body2'}>12:00</Typography>
                        </Stack>
                    </Stack>
                </Card>
            </Stack>
            <Stack
                component={'main'}
                sx={{
                    display: 'flex',
                    flex: 1,
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                }}>
                    {
                        chatMessage.map((item, index) => {
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
                                        borderRadius: item.sender.uid === user.uid ? '10px 10px 0 10px' : '10px 10px 10px 0', }}>
                                        <Avatar
                                            sx={{ width: 40, height: 40 }} />
                                        <Stack spacing={0} direction={'column'}>
                                            <Typography
                                                variant={'body1'}
                                                sx={{
                                                    color: item.sender.uid === user.uid ? '#fff' : '#000'
                                                }}
                                            >{
                                                item.message.text
                                            }
                                            </Typography>
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
            <Box
                ref={ref}
                sx={{
                    width: '100%',
                }}>
                <Box
                    sx={{
                        background: '#f3f5f7',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                        p: 2,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    <IconButton>
                        <EmojiEmotionsOutlined/>
                    </IconButton>
                    <IconButton>
                        <AttachFileOutlined/>
                    </IconButton>
                    <OutlinedInput
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleEnter}
                        size={'small'}
                        sx={{
                            borderRadius: 20,
                            background: 'white',
                        }}
                        placeholder={'Type a message'}
                        fullWidth={true}/>
                    <IconButton>
                        <SendOutlined/>
                    </IconButton>
                </Box>

            </Box>
        </Box>
    )
}

export { ChatItem };
