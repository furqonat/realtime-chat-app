import { Route, Routes } from 'react-router-dom'
import { RoutePath } from './components/utils'
import './index.css'
import "moment/locale/id";
import { EntryPoint, SignInQr, Verification } from './pages'

const App = () => {

    return (
        <Routes>
            <Route index element={<SignInQr />} />
            <Route path={RoutePath.INDEX} element={<EntryPoint />} />
            <Route path={RoutePath.VERIFY} element={<Verification/>} />
        </Routes>
    )
}

export default App