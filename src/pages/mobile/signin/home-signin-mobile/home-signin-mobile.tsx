import React from 'react'
import {
    MuiTelInput,
    MuiTelInputCountry,
    MuiTelInputInfo,
    MuiTelInputContinent
  } from 'mui-tel-input';
  import { createTheme } from '@mui/material/styles';
import './style.css'
import { Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from "hooks";

const HomeSignInMobile = () => {

const navigate = useNavigate();
const [value, setValue] = React.useState<string>('')
const dispatch = useAppDispatch()



const handleChange = (newValue: string, info: MuiTelInputInfo) => {
    setValue(newValue)
    
  }
  const continents: MuiTelInputContinent[] = ['AS']
  const excludedCountries: MuiTelInputCountry[] = ['MY']


  
  const navigateToSendOtp = () => {
        console.log(value)
        dispatch(setValue(value))
        navigate('./signin')
  }

 createTheme({
    palette: {
      action: {
        disabledBackground: 'grey[500]',
        disabled: '#fff'
      }
    }
})
    

return (
    <div className='container'>
        <form> 
        <div className = 'logo' >R</div> 
        <div>{value}</div>
            < div className = 'text' > Login Your To Account</div> 
            <MuiTelInput
                style={{width: '250px',
                    height:'40px'
                }}
                value={value}
                onChange={handleChange}
                continents={continents}
                excludedCountries={excludedCountries}
                />
            <div className = 'btn' > 
                <Button className='btn-primary'
                 onClick={navigateToSendOtp} disabled={!value}>Next</Button>
            </div>
        </form>

        </div>
           
     

    )
}

export {
    HomeSignInMobile
}