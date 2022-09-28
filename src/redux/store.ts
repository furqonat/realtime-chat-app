import { configureStore } from '@reduxjs/toolkit'
import openMessageReducer from './openMessageReducer'
import phoneNumberReducer from './phoneReducer'

export const store = configureStore({
    reducer: {
        phone: phoneNumberReducer,
        openMessage: openMessageReducer,
    }
})
//@ts-ignore
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch