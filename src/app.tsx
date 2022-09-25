import { Route, Routes } from 'react-router-dom'
import { RoutePath } from './components/utils'
import { Chats } from './pages'
import './index.css'
import { SignInQr, Verification } from './pages/web'

const App = () => {

    return (
        <Routes>
            <Route index element={<SignInQr />} />
            <Route path={RoutePath.INDEX} element={<Chats />} />
            <Route path={RoutePath.VERIFY} element={<Verification/>} />
        </Routes>
    )
}

export default App