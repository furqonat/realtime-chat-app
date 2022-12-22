import { DeleteOutlined, MicOutlined, SendOutlined, StopOutlined } from "@mui/icons-material"
import { IconButton, Stack, Box } from "@mui/material"
import { FC, useState } from "react"

interface IAudioRecorderProps {
    id: string, 
    onSend?: (blob: string) => void,
}


const AudioRecorder: FC<IAudioRecorderProps> = (props) => {


    const [audioURL, setAudioURL] = useState<string>('')
    const [base64, setBase64] = useState<string>('')
    const [isRecording, setIsRecording] = useState<boolean>(false)
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>()


    const recordAudio = async () => {
        setIsRecording(true)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        setMediaRecorder(mediaRecorder)
        mediaRecorder.start()
        const chunks: Blob[] = []
        const reader = new FileReader()
        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data)
            reader.readAsDataURL(e.data)
        }
        return {
            onStop: (cb: (blob: Blob) => void) => {
                mediaRecorder.onstop = (e) => {
                    const audioBlob = new Blob(chunks, { type: 'audio/ogg' })
                    cb(audioBlob)
                    setIsRecording(false)
                }
            },
            base64: () => {
                return new Promise((resolve, reject) => {
                    reader.onloadend = () => {
                        resolve(reader.result)
                    }
                    reader.onerror = reject
                })
            }
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                borderRadius: 2,
                flexDirection: 'column',
                alignItems: 'center',
            }}>
            {/* <div ref={ref} id={props.id}>

            </div> */}
            {
                audioURL !== '' && (
                    <audio
                        controls
                        src={audioURL}/>
                )
            }
            <Stack
                spacing={2}
                direction={"row"}>
                {
                    audioURL === '' && (
                        <IconButton
                            onClick={() => {
                                isRecording ? mediaRecorder?.stop() : recordAudio().then((recorder) => {
                                    recorder.onStop((blob) => {
                                        setAudioURL(URL.createObjectURL(blob))
                                    })
                                    recorder.base64().then((base) => {
                                        setBase64(base as string)
                                    })
                                })
                            }}>
                            {
                                isRecording ? <StopOutlined /> : <MicOutlined />
                            }
                        </IconButton>
                    )
                }
                {
                    audioURL !== '' && (
                        <IconButton
                            onClick={() => {
                                setAudioURL('')
                            }}>
                            <DeleteOutlined />
                        </IconButton>
                    )
                }
                {
                    audioURL !== '' && (
                        <IconButton
                            onClick={() => {
                                props.onSend?.(base64)
                                setBase64('')
                            }}>
                            <SendOutlined />
                        </IconButton>
                    )
                }
            </Stack>
        </Box>
    )
}

const AudioPlayer = () => {

    return (
        <Box>
        </Box>
    )
}

export { AudioRecorder, AudioPlayer }
