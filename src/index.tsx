window.global ||= window

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./app"
import { FirebaseProvider } from "./utils"
import { registerServiceWorker } from './service-worker'

const app = ReactDOM.createRoot(document.getElementById('app') as HTMLElement)

const theme = createTheme({
    palette: {
        primary: {
            main: '#1a237e',
            dark: '#121858',
            light: '#474f97',
            contrastText: '#fff'
        },
        secondary: {
            main: '#f50057',
            dark: '#b28704',
            light: '#ffcd38',
            contrastText: '#000'
        }
    },
    typography: {
        fontFamily: [
            'Roboto',
            'sans-serif'
        ].join(','),
    }
})

app.render(
    <BrowserRouter>
        <FirebaseProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline>
                    <App/>
                </CssBaseline>
            </ThemeProvider>
        </FirebaseProvider>
    </BrowserRouter>
)

registerServiceWorker()
