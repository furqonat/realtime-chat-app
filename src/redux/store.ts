import { configureStore } from '@reduxjs/toolkit'
import phoneNumberReducer from './phoneReducer'

export const store = configureStore({
    reducer: {
        phone: phoneNumberReducer
    }
})
//@ts-ignore
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch