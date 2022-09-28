import {
    CallOutlined, ForumOutlined, HistoryToggleOffOutlined, ReceiptLongOutlined
} from "@mui/icons-material";
import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { Chat } from "./chats";
import { Transaction } from "./transactions";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    style?: React.CSSProperties;
}


const TabPanel = (props: TabPanelProps) => {
    const {children, value, index, style, ...other} = props;

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
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                    {children}
                </Box>
            )}
        </div>
    );
}



const Layout = () => {
    const [value, setValue] = useState('1')

    return (
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
                        style={{margin: '15px 0'}}
                        icon={<ForumOutlined/>}
                        aria-controls={'vertical-tabpanel-1'}
                        aria-label={'chats'}/>
                    <Tab
                        value={'2'}
                        style={{margin: '15px 0'}}
                        icon={<ReceiptLongOutlined/>}
                        aria-controls={'vertical-tabpanel-1'}
                        aria-label={'transactions'}/>
                    <Tab
                        value={'3'}
                        style={{margin: '15px 0'}}
                        icon={<CallOutlined/>}
                        aria-controls={'vertical-tabpanel-1'}
                        aria-label={'calls'}/>
                    <Tab
                        value={'4'}
                        style={{margin: '15px 0'}}
                        icon={<HistoryToggleOffOutlined/>}
                        aria-controls={'vertical-tabpanel-1'}
                        aria-label={'stories'}/>
                </Tabs>
            </Box>
            <TabPanel value={1} index={parseInt(value)} style={{width: '100%'}}>
                <Chat/>
            </TabPanel>
            <TabPanel value={2} index={parseInt(value)} style={{width: '100%'}}>
                <Transaction/>
            </TabPanel>
            <TabPanel value={3} index={parseInt(value)} style={{width: '100%'}}>
            </TabPanel>
            <TabPanel value={4} index={parseInt(value)} style={{width: '100%'}}>
            </TabPanel>
        </Box>
    )
}


export { SignInQr, Verification } from './signin';
export { Layout };

