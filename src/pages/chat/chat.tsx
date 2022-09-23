import { MessageOutlined } from "@mui/icons-material";
import {
    Box, Tab, Tabs, Typography
} from "@mui/material";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const Chat = () => {

    return (
        <Box style={{display: 'flex', flexDirection: 'row'}}>
            <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center' }}>
                <Tabs
                    centered={true}
                    orientation={'vertical'}>
                    <Tab icon={<MessageOutlined />} value={'1'} />
                </Tabs>
            </Box>
            <TabPanel value={1} index={1}>
                <h1>Chat</h1>
            </TabPanel>
        </Box>
    )
}

export { Chat };

