import {Route, Routes} from 'react-router-dom'
import { RoutePath } from './components/utils'
import { Chat } from './pages'

const App = () => {

    return (
        <Routes>
            <Route path={RoutePath.INDEX} element={<Chat />} />
        </Routes>
    )
}

export default App