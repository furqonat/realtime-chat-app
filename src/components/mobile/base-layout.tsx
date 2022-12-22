import { Box } from "@mui/material"


const BaseLayout: React.FC<{ children?: React.ReactNode, dir: 'row' | 'column' }> = (props) => {

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                flexDirection: props.dir,
                mx: 'auto',
                maxWidth: '375px', // TODO: remove this and use percentage
            }}>
            {props.children}
        </Box>
    )
}

export { BaseLayout }