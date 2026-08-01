import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: [],
        activeChatId: null,
        messages: [],
        loading: false,
        sending: false,
        error: null,
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        addChat: (state, action) => {
            state.chats.unshift(action.payload);
        },
        removeChat: (state, action) => {
            state.chats = state.chats.filter(chat => chat._id !== action.payload);
            if (state.activeChatId === action.payload) {
                state.activeChatId = null;
                state.messages = [];
            }
        },
        updateChat: (state, action) => {
            const index = state.chats.findIndex(c => c._id === action.payload._id);
            if (index !== -1) {
                state.chats[index] = { ...state.chats[index], ...action.payload };
            }
        },
        setActiveChatId: (state, action) => {
            state.activeChatId = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setSending: (state, action) => {
            state.sending = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetChatState: (state) => {
            state.activeChatId = null;
            state.messages = [];
            state.sending = false;
            state.loading = false;
        }
    }
});

export const {
    setChats,
    addChat,
    removeChat,
    updateChat,
    setActiveChatId,
    setMessages,
    addMessage,
    setLoading,
    setSending,
    setError,
    resetChatState
} = chatSlice.actions;

export default chatSlice.reducer;
