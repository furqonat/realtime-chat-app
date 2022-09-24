import {Route, Routes} from 'react-router-dom'
import { RoutePath } from './components/utils'
import { ChatMobile,VoiceCallMobile } from './pages'
import './index.css'

const App = () => {

    return (
        <Routes>
            <Route path={RoutePath.INDEX} element={<ChatMobile />} />
            <Route path={RoutePath.CHAT_VOICE_CALL_MOBILE} element={<VoiceCallMobile />} />
        </Routes>
    )
}

export default App