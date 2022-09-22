import {Route, Routes} from 'react-router-dom'
import { RoutePath } from './components/utils'
import { Chat, VoiceCall } from './pages'
import './index.css'

const App = () => {

    return (
        <Routes>
            <Route path={RoutePath.INDEX} element={<Chat />} />
            <Route path={RoutePath.CHAT_VOICE_CALL} element={<VoiceCall />} />
        </Routes>
    )
}

export default App