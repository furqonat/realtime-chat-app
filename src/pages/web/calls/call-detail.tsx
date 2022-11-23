import { CallMade, CallMissed, CallMissedOutgoing, CallOutlined, CallReceived, Videocam } from "@mui/icons-material"
import { Avatar, Box, IconButton, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import { useContact, useUserInfo } from "hooks"
import { ICall } from "interfaces"
import moment from "moment"
import { CallState, useFirebases } from "utils"

const CallDetail: React.FC<{ call: ICall, innerCalls?: ICall[] }> = (props) => {
    
    const { user } = useFirebases()
    const { contact } = useContact({
        contactId: props.call.phoneNumber === user?.phoneNumber ? props.call.receiver.uid : props.call.caller.uid,
        user: user
    })
    const id = user.uid === props.call.caller.uid ? user.uid + props.call.receiver.uid : props.call.receiver.uid + user.uid
    const callId = id + new Date().getTime()
    const getDisplayNameOrPhoneNumber = () => {
        if (contact) {
            return contact.displayName
        }
        return props.call.phoneNumber === user?.phoneNumber ? props.call.receiver.phoneNumber : props.call.caller.phoneNumber
    }

    const { userInfo } = useUserInfo({
        phoneNumber: user.uid === props.call.caller.uid ? props.call.receiver.phoneNumber : props.call.caller.phoneNumber
    })

    const getCallStatusIcon = (call: ICall): {title: string, icon: React.ReactNode} => {
        if (call.phoneNumber === user.phoneNumber) {
            if (call.status === CallState.UNANSWERED) {
                return {
                    title: "Tidak Terjawab",
                    icon: <CallMissedOutgoing fontSize={'small'} />
                }
            } else {
                return {
                    title: "Panggilan Keluar",
                    icon: <CallMade fontSize={'small'}/>
                }
            }
        } else {
            if (call.status === CallState.UNANSWERED) {
                return {
                    title: "Tidak Terjawab",
                    icon: <CallMissed fontSize={'small'} color={'error'} />
                }
            } else {
                return {
                    title: "Panggilan Masuk",
                    icon: <CallReceived fontSize={'small'}/>
                }
            }
        }
    }

    const handleClickVideoCam = () => {
        window.open(`/video-call/${callId}/call/video/${props.call.phoneNumber === user.phoneNumber ? props.call.receiver.phoneNumber : props.call.phoneNumber}`, '_blank', '')
    }
    
    const handleClickCall = () => {
        window.open(`/video-call/${callId}/call/voice/${props.call.phoneNumber === user.phoneNumber ? props.call.receiver.phoneNumber : props.call.phoneNumber}`, '_blank', '')
    }
    return (
        <Stack
            component={'section'}
            sx={{
                height: 'calc(100vh)'
            }}
            direction={'column'}>
            <Box
                component={'header'}
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    p: 2,
                    alignItems: 'center',
                    borderBottom: '1px solid #e0e0e0',
                    justifyContent: 'space-between'
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            mr: 2
                        }}
                        src={userInfo?.photoURL} />
                    <Stack direction={'column'} spacing={0}>
                        <Typography
                            variant={'body1'}>
                            {getDisplayNameOrPhoneNumber()}
                        </Typography>

                        <Typography
                            variant={'subtitle2'}>
                            {
                                moment(props.call.time).format('DD MMMM YYYY')
                            }
                        </Typography>
                    </Stack>
                </Box>
                <Stack direction={'row'} spacing={2}>
                    <IconButton
                        onClick={handleClickVideoCam}>
                        <Videocam/>
                    </IconButton>
                    <IconButton
                        onClick={handleClickCall}>
                        <CallOutlined/>
                    </IconButton>
                </Stack>
            </Box>
            <Stack
                component={'main'}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    flex: 1,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '0.4em',
                    },
                    '&::-webkit-scrollbar-track': {
                        borderRadius: '20px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#dadada',
                    }
                }}>
                {
                    props.innerCalls?.map((call, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 2,
                                px: 2,
                                justifyContent: 'space-between',
                                '&:hover': {
                                    background: '#f3f5f7',
                                    cursor: 'pointer'
                                },
                                background: 'none'
                            }}>
                            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ py: 2 }}>
                                <Stack spacing={0} direction={'column'}>
                                    <Stack direction={'row'} spacing={1}>
                                        <Typography variant={'body1'}>
                                            {
                                                getCallStatusIcon(call).icon
                                            }
                                        </Typography>
                                        <Typography variant={'body1'}>
                                            {
                                                getCallStatusIcon(call).title
                                            }
                                        </Typography>
                                    </Stack>
                                    <Typography variant={'body2'}>
                                        <Stack direction={'row'} spacing={2} justifyItems={'center'}>
                                            <Typography variant={'body2'}>
                                                {
                                                    moment(call.time).format('DD MMMM YYYY')
                                                }
                                            </Typography>
                                            <Typography variant={'body2'}>
                                                {
                                                    moment(call.time).format('HH:mm')
                                                }
                                            </Typography>
                                        </Stack>
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Box>
                    ))

                }
            </Stack>
        </Stack>
    )
}

export { CallDetail }
