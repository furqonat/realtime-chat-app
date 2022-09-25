import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./app"
import { FirebaseProvider } from "./utils/firebase"
import { Provider } from "react-redux";
import { store } from 'redux/store'


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
        },
    }
})

app.render(
    <BrowserRouter>
        <FirebaseProvider>
            <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline>
                    <App />
                </CssBaseline>
            </ThemeProvider>
            </Provider>
        </FirebaseProvider>
    </BrowserRouter>
)