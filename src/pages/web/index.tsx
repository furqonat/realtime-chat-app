import {
    Call,
    CallEndOutlined,
    CallOutlined, ForumOutlined, PersonOutline, ReceiptLongOutlined
} from "@mui/icons-material"
import { Avatar, Box, Drawer, IconButton, Stack, Tab, Tabs, Typography } from "@mui/material"
import { doc, updateDoc } from "firebase/firestore"
import { useVideoCall } from "hooks"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { db, useFirebases } from "utils"
import { Calls } from "./calls"
import { Chat } from "./chats"
import { Person } from "./person"
import { Transaction } from "./transactions"

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    style?: React.CSSProperties;
}

// TODO: move the drawer call in app.tsx if nessesary, and add new story on new contract

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, style, ...other } = props;
    const navigate = useNavigate()
    const [drawerCall, setDrawerCall] = useState(true)

    const { user } = useFirebases()

    const { call } = useVideoCall({ user })

    const handleOnCallReject = () => {
        const dbRef = doc(db, 'calls', call.callId)
        updateDoc(dbRef, {
            status: 'rejected'
        }).then(() => {
            setDrawerCall(false)
        })
    }

    const handleOnCallAccept = () => {
        navigate(`/video-call/${call.callId}/answer/${call.callType}/${user?.phoneNumber}`)
    }

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={style}
            {...other}
        >
            {value === index && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {children}
                </Box>
            )}
            {
                call !== null && (
                    <Drawer
                        anchor={'bottom'}
                        open={drawerCall}>
                        <Stack
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                p: 5,
                            }}
                            spacing={2}>
                            <Avatar
                                sx={{ width: 100, height: 100, mx: 'auto' }}
                                src={call?.photoURL} />
                            <Typography variant={'h5'}>{call?.displayName}</Typography>
                            <Typography variant={'body1'}>{call?.phoneNumber}</Typography>
                            <Stack direction={'row'} spacing={2} sx={{ mx: 'auto' }}>
                                <IconButton
                                    onClick={handleOnCallReject}>
                                    <CallEndOutlined
                                        color={'error'} />
                                </IconButton>
                                <IconButton
                                    onClick={handleOnCallAccept}>
                                    <Call
                                        color={'info'} />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Drawer>
                )
            }
        </div>
    );
}



const Layout = () => {
    const [value, setValue] = useState('1')

    return (
        <Stack
            direction={'column'}>
            {
            }
            <Box
                style={{ display: 'flex', flexDirection: 'row' }}>
                <Box sx={{
                    display: 'flex', minHeight: '100vh', alignItems: 'center', borderRight: 1, borderColor: 'divider',
                }}>
                    <Tabs
                        variant={'fullWidth'}
                        value={value}
                        onChange={(_, value: string) => setValue(value)}
                        aria-label="tabs icon"
                        classes={{
                            indicator: 'primary.dark',
                        }}
                        orientation={'vertical'}>
                        <Tab
                            value={'1'}
                            style={{ margin: '15px 0' }}
                            icon={<ForumOutlined />}
                            aria-controls={'vertical-tabpanel-1'}
                            aria-label={'chats'} />
                        <Tab
                            value={'2'}
                            style={{ margin: '15px 0' }}
                            icon={<ReceiptLongOutlined />}
                            aria-controls={'vertical-tabpanel-1'}
                            aria-label={'transactions'} />
                        <Tab
                            value={'3'}
                            style={{ margin: '15px 0' }}
                            icon={<CallOutlined />}
                            aria-controls={'vertical-tabpanel-1'}
                            aria-label={'calls'} />
                        <Tab
                            value={'4'}
                            style={{ margin: '15px 0' }}
                            icon={<PersonOutline />}
                            aria-controls={'vertical-tabpanel-1'}
                            aria-label={'stories'} />
                    </Tabs>
                </Box>
                <TabPanel value={1} index={parseInt(value)} style={{ width: '100%' }}>
                    <Chat />
                </TabPanel>
                <TabPanel value={2} index={parseInt(value)} style={{ width: '100%' }}>
                    <Transaction />
                </TabPanel>
                <TabPanel value={3} index={parseInt(value)} style={{ width: '100%' }}>
                    <Calls />
                </TabPanel>
                <TabPanel value={4} index={parseInt(value)} style={{ width: '100%' }}>
                    <Person />
                </TabPanel>
            </Box>
        </Stack>

    )
}


export { VideoCall } from './calls'
export { SignIn, Verification } from './signin'
export { Layout }
export { Verification as VerificationID } from './verification'

