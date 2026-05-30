import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocketConnection } from "../service/chat.socket";
import * as chatApi from "../service/chat.api";
import {
    setChats,
    addChat,
    removeChat,
    setActiveChatId,
    setMessages,
    addMessage,
    setLoading,
    setSending,
    setError,
    resetChatState,
} from "../chat.slice";

export const useChat = () => {
    const dispatch = useDispatch();

    const chats = useSelector((state) => state.chat.chats);
    const activeChatId = useSelector((state) => state.chat.activeChatId);
    const messages = useSelector((state) => state.chat.messages);
    const loading = useSelector((state) => state.chat.loading);
    const sending = useSelector((state) => state.chat.sending);
    const error = useSelector((state) => state.chat.error);

    const loadChats = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const data = await chatApi.getChats();
            if (data && data.chats) {
                // Backend might return chats sorted or unsorted. Let's make sure it's sorted by creation date or order
                const sortedChats = [...data.chats].reverse(); // newest first
                dispatch(setChats(sortedChats));
            }
        } catch (err) {
            dispatch(setError(err.message || "Failed to load chats"));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const loadMessages = useCallback(async (chatId) => {
        if (!chatId) return;
        try {
            dispatch(setLoading(true));
            dispatch(setActiveChatId(chatId));
            const data = await chatApi.getMessages(chatId);
            if (data && data.message) {
                dispatch(setMessages(data.message));
            }
        } catch (err) {
            dispatch(setError(err.message || "Failed to load messages"));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const sendUserMessage = useCallback(async (content) => {
        if (!content || content.trim() === "") return;
        
        const currentChatId = activeChatId;

        // Create temporary user message to make UI feel extremely fast
        const tempUserMessage = {
            _id: `temp-user-${Date.now()}`,
            content: content,
            role: "user",
            createdAt: new Date().toISOString(),
        };

        dispatch(addMessage(tempUserMessage));
        dispatch(setSending(true));

        try {
            const data = await chatApi.sendMessage({
                message: content,
                chatId: currentChatId,
            });

            if (data) {
                // If it's a new chat, we need to register the active chat ID and reload the chats list
                if (!currentChatId && data.chat) {
                    dispatch(setActiveChatId(data.chat._id));
                    dispatch(addChat(data.chat));
                }
                
                // Replace messages with the official response or update them
                if (data.chat) {
                    const messagesData = await chatApi.getMessages(data.chat._id);
                    if (messagesData && messagesData.message) {
                        dispatch(setMessages(messagesData.message));
                    }
                }
            }
        } catch (err) {
            dispatch(setError(err.message || "Failed to send message"));
            // Remove the temporary message in case of failure or mark as failed
        } finally {
            dispatch(setSending(false));
        }
    }, [dispatch, activeChatId]);

    const createNewThread = useCallback(() => {
        dispatch(resetChatState());
    }, [dispatch]);

    const deleteThread = useCallback(async (chatId) => {
        if (!chatId) return;
        try {
            await chatApi.deleteChat(chatId);
            dispatch(removeChat(chatId));
        } catch (err) {
            dispatch(setError(err.message || "Failed to delete chat"));
        }
    }, [dispatch]);

    return {
        chats,
        activeChatId,
        messages,
        loading,
        sending,
        error,
        loadChats,
        loadMessages,
        sendUserMessage,
        createNewThread,
        deleteThread,
        initializeSocketConnection,
    };
};