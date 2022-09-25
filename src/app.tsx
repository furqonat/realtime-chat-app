import {Route, Routes} from 'react-router-dom'
import { RoutePath } from './components/utils'
import {    ChatMobile, 
            VoiceCallMobile, 
            HomeSignInMobile,
            SendOtp,
        } from './pages';
import './index.css'

const App = () => {

    return (
        
            <Routes>
                <Route index element={<HomeSignInMobile/>} />
                <Route path={RoutePath.INDEX} element={<ChatMobile />} />
                <Route path={RoutePath.CHAT_VOICE_CALL_MOBILE} element={<VoiceCallMobile />} />
                <Route path={RoutePath.SIGNIN} element={<SendOtp />} /> 
            </Routes>
            
        
    )
}

export default App