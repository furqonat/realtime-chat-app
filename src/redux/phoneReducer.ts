import { createSlice } from "@reduxjs/toolkit";


const phoneNumberReducer = createSlice({
    name: 'phoneNumber',
    initialState: {
        phoneNumber: ''
    },
    reducers: {
        setPhone: (state, action) => {
            state.phoneNumber = action.payload
        }
    }
})

export const { setPhone } = phoneNumberReducer.actions
export default phoneNumberReducer.reducer