import {
    CallOutlined, ForumOutlined,
    HistoryToggleOffOutlined, MoreVertOutlined,
    NotificationsOutlined, ReceiptLongOutlined
} from "@mui/icons-material";
import {
    Box, Popover, Stack, Tab, Tabs, Typography
} from "@mui/material";
import { useState } from "react";
import { Chat } from "./tabs";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    style?: React.CSSProperties;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, style, ...other } = props;

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
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const Chats = () => {

    const [value, setValue] = useState('1')
    const [anchorMore, setAnchorMore] = useState<null | SVGSVGElement>(null)
    const [openPopup, setOpenPopup] = useState(false)

    const handlePopup = (event: React.MouseEvent<SVGSVGElement>) => {
        event.preventDefault()
        setAnchorMore(event.currentTarget)
        setOpenPopup(!openPopup)
    }


    return (
        <Box style={{display: 'flex', flexDirection: 'row'}}>
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
                        style={{margin: '15px 0'}}
                        icon={<ForumOutlined />}
                        aria-controls={'vertical-tabpanel-1'}
                        aria-label={'chats'} />
                    <Tab
                        value={'2'}
                        style={{margin: '15px 0'}}
                        icon={<ReceiptLongOutlined />}
                        aria-controls={'vertical-tabpanel-1'}
                        aria-label={'transactions'} />
                    <Tab
                        value={'3'}
                        style={{margin: '15px 0'}}
                        icon={<CallOutlined />}
                        aria-controls={'vertical-tabpanel-1'}
                        aria-label={'calls'} />
                    <Tab
                        value={'4'}
                        style={{margin: '15px 0'}}
                        icon={<HistoryToggleOffOutlined />}
                        aria-controls={'vertical-tabpanel-1'}
                        aria-label={'stories'} />
                </Tabs>
            </Box>
            <TabPanel value={1} index={parseInt(value)} style={{ width: '100%' }}>
                <Chat />
            </TabPanel>
            <TabPanel value={2} index={parseInt(value)} style={{ width: '35%' }}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                    <Typography variant={'h5'}>Transactions</Typography>
                    <Stack spacing={2} direction={'row'}>
                        <NotificationsOutlined style={{ cursor: 'pointer' }} />
                        <MoreVertOutlined onClick={handlePopup} style={{ cursor: 'pointer' }} aria-describedby={'more'} />
                        <Popover
                            id={'more'}
                            anchorEl={anchorMore}
                            onClose={() => setOpenPopup(false)}
                            open={openPopup}>
                            <Stack spacing={2} direction={'column'} sx={{ p: 2 }}>
                                <Typography variant={'body1'}>Notifications</Typography>
                            </Stack>
                        </Popover>
                    </Stack>
                </Box>
            </TabPanel>
            <TabPanel value={3} index={parseInt(value)} style={{ width: '35%' }}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                    <Typography variant={'h5'}>Calls</Typography>
                    <Stack spacing={2} direction={'row'}>
                        <NotificationsOutlined style={{ cursor: 'pointer' }} />
                        <MoreVertOutlined onClick={handlePopup} style={{ cursor: 'pointer' }} aria-describedby={'more'} />
                        <Popover
                            id={'more'}
                            anchorEl={anchorMore}
                            onClose={() => setOpenPopup(false)}
                            open={openPopup}>
                            <Stack spacing={2} direction={'column'} sx={{ p: 2 }}>
                                <Typography variant={'body1'}>Notifications</Typography>
                            </Stack>
                        </Popover>
                    </Stack>
                </Box>
            </TabPanel>
            <TabPanel value={4} index={parseInt(value)} style={{ width: '35%' }}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                    <Typography variant={'h5'}>Stories</Typography>
                    <Stack spacing={2} direction={'row'}>
                        <NotificationsOutlined style={{ cursor: 'pointer' }} />
                        <MoreVertOutlined onClick={handlePopup} style={{ cursor: 'pointer' }} aria-describedby={'more'} />
                        <Popover
                            id={'more'}
                            anchorEl={anchorMore}
                            onClose={() => setOpenPopup(false)}
                            open={openPopup}>
                            <Stack spacing={2} direction={'column'} sx={{ p: 2 }}>
                                <Typography variant={'body1'}>Notifications</Typography>
                            </Stack>
                        </Popover>
                    </Stack>
                </Box>
            </TabPanel>
        </Box>
    )
}

export { Chats }

