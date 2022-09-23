import { Container } from "@mui/material"
import { useNavigate } from "react-router-dom"


// todo: implementation qr code scanner

const SignIn = () => {
    const navigate = useNavigate()
    return (
        <Container>
            <h1>Sign In</h1>
        </Container>
    )
}

export {SignIn}