import { createSlice } from "@reduxjs/toolkit";
import { IChatItem, IChatMessage } from "interfaces";

interface OpenMessageState {
    open: boolean,
    chatItem: IChatItem,
    chatMessages?: IChatMessage[],
}

const initialState: OpenMessageState = {
    open: false,
    chatItem: {
        uid: "",
        phoneNumber: "",
        displayName: "",
        isIDCardVerified: false,
        photoURL: "",
        lastLogin: {},
        status: "",
    },
    chatMessages: [],
}

const openMessageReducer = createSlice({
    name: 'openReducer',
    initialState,
    reducers: {
        openMessage: (state) => {
            state.open = true;
        },
        setChatItem: (state, action) => {
            state.chatItem = action.payload;
        },
        setChatMessages: (state, action) => {
            state.chatMessages = action.payload;
        }
    }
}) 

export const { openMessage, setChatItem, setChatMessages } = openMessageReducer.actions
export default openMessageReducer.reducer