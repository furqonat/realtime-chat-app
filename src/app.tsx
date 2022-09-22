import {Route, Routes} from 'react-router-dom'
import { RoutePath } from './components/utils'
import { Home } from './pages'

const App = () => {

    return (
        <Routes>
            <Route path={RoutePath.INDEX} element={<Home />} />
        </Routes>
    )
}

export default App