import {
    CallMadeOutlined, CallMissedOutgoingOutlined,
    CallMissedOutlined, CallOutlined, CallReceived, Videocam
} from "@mui/icons-material"
import { Avatar, Box, Chip, IconButton, Stack, Typography } from "@mui/material"
import { useContact } from "hooks"
import { ICall } from "interfaces"
import moment from "moment"
import { useState } from "react"
import { CallState, useFirebases } from "utils"

interface ICallGroup extends ICall {
    length: number,
    calls?: ICall[]
}


const CallList: React.FC<{
    calls: ICall[],
    onClick?: (info: string) => void,
    filterOptions?: string,
    innerCalls?: (calls: ICall[]) => void
}> = (props) => {

    const [selected, setSelected] = useState(null)

    const groupCalls = (calls: ICall[]) => {
        const callGroups: ICallGroup[] = []
        let callGroup: ICallGroup = null
        for (let i = 0; i < calls.length; i++) {
            const call = calls[i]
            if (callGroup) {
                const previousCall = calls[i - 1]
                const diff = moment(previousCall.time).diff(moment(call.time), 'minutes')
                if (diff <= 2 && call.callType === previousCall.callType && call.phoneNumber === previousCall.phoneNumber) {
                    callGroup.length += 1
                    callGroup.calls.push(call)
                } else {
                    callGroups.push(callGroup)
                    callGroup = {
                        ...call,
                        length: 1,
                        calls: [call]
                    }
                }
            } else {
                callGroup = {
                    ...call,
                    length: 1,
                    calls: [call]
                }
            }
        }
        if (callGroup) {
            callGroups.push(callGroup)
        }
        return callGroups
    }


    return (
        <Stack
            component={'main'}
            sx={{
                display: 'flex',
                overflow: 'auto',
                flex: 1,
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
                groupCalls(props.calls)?.map((call) => {
                    return (
                        <Item
                            key={call.callId}
                            call={call}
                            selected={selected !== null && selected === call.callId}
                            onSelect={(event: string) => {
                                setSelected(event)
                            }}
                            filters={props.filterOptions}
                            onClick={(event: string) => {
                                props.onClick && props.onClick(event)
                                props.innerCalls && props.innerCalls(call.calls)
                            }} />
                    )
                })
            }
        </Stack>
    )
}


const Item: React.FC<{
    call: ICallGroup,
    onSelect: (data: string) => void,
    onClick: (data: string) => void,
    filters?: string,
    selected?: boolean
}> = (props) => {

    const { call, onClick, onSelect, selected, filters } = props
    const { user } = useFirebases()
    const { contact } = useContact({ user: user, contactId: user.uid === call.caller.uid ? call.receiver.uid : call.caller.uid })

    const getOwnerDisplayNameOrPhoneNumber = () => {
        if (contact) {
            return contact.displayName
        } else {
            if (call.phoneNumber === user.phoneNumber) {
                return call.receiver.phoneNumber
            }
            return call.phoneNumber
        }
    }


    const getCallIcon = () => {
        switch (call.status) {
            case CallState.UNANSWERED:
                if (call.phoneNumber !== user.phoneNumber) {
                    return <CallMissedOutlined fontSize={'small'} />
                } else {
                    return <CallMissedOutgoingOutlined fontSize={'small'} />
                }
            default:
                if (call.phoneNumber !== user.phoneNumber) {
                    return <CallReceived fontSize={'small'} />
                } else {
                    return <CallMadeOutlined fontSize={'small'} />
                }
        }
    }

    const filterOptions = () => {
        if (filters) {
            if (getOwnerDisplayNameOrPhoneNumber().toLowerCase().includes(filters.toLowerCase())) {
                return 'flex'
            }
            return 'none'
        }
        return 'flex'
    }


    return (

        <Box
            onClick={() => {
                onSelect && onSelect(call.callId)
                onClick && onClick(call.callId)
            }}
            sx={{
                display: filterOptions(),
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2, px: 2, justifyContent: 'space-between',
                '&:hover': {
                    background: '#f3f5f7',
                    cursor: 'pointer'
                },
                background: selected ? '#f3f5f7' : 'none'
            }}>
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ py: 2 }}>
                <Avatar sx={{ width: 40, height: 40 }} src={call.receiver.photoURL} />
                <Stack spacing={0} direction={'column'}>
                    <Typography variant={'body1'}>
                        {
                            getOwnerDisplayNameOrPhoneNumber()
                        }
                    </Typography>
                    <Typography variant={'body2'}>
                        <Stack direction={'row'} spacing={2} justifyItems={'center'}>
                            <Chip
                                size={'small'}
                                icon={
                                    getCallIcon()
                                }
                                label={moment(call.time).format('hh:mm A')} />
                            {
                                call.length > 1 &&
                                <Chip
                                    size={'small'}
                                    label={`${call.length} panggilan`} />

                            }
                        </Stack>
                    </Typography>
                </Stack>
            </Stack>
            {
                call.callType === 'video' ? (
                    <IconButton>
                        <Videocam
                            titleAccess={'Call Again?'} />
                    </IconButton>
                ) : (
                    <IconButton>
                        <CallOutlined
                        />
                    </IconButton>
                )
            }
        </Box>
    )
}

export { CallList }
