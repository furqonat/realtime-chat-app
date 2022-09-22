import { useNavigate } from "react-router-dom"
import { RoutePath } from "../../components"


const Chat = () => {
    const navigate = useNavigate()
    return (
        <div onClick={() => {
            navigate(RoutePath.CHAT_VOICE_CALL)
        }}>
            Voice Call
        </div>
    )
}

export {Chat}