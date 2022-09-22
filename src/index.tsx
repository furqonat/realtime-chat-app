import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./app"
import { FirebaseProvider } from "./components"

const app = ReactDOM.createRoot(document.getElementById('app') as HTMLElement)

app.render(
    <BrowserRouter>
        <FirebaseProvider>
            <App />
        </FirebaseProvider>
    </BrowserRouter>
)