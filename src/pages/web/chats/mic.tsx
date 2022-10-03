import { Box, Modal, Stack } from "@mui/material"
import { AudioRecorder } from "components"
import { FC } from "react"

interface IMicProps {
    open: boolean,
    onClose: () => void,
    onSend?: (blob: string) => void,
}


const Mic: FC<IMicProps> = (props) => {
    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            aria-labelledby={"modal-modal-title"}
            aria-describedby={"modal-modal-description"}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '30%',
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 2
                }}>
                <Stack
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                    spacing={2}>
                    <AudioRecorder id={"modal-modal-title"} onSend={(base64) => props.onSend?.(base64)} />
                </Stack>
            </Box>
        </Modal>
    )
}

export { Mic }
