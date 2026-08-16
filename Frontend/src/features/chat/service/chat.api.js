import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.PROD ? "" : "http://localhost:3000",
    withCredentials: true,
});

export async function getChats() {
    const response = await api.get("/api/chats/");
    return response.data; // Expected: { message: "...", chats: [...] }
}

export async function getMessages(chatId) {
    const response = await api.get(`/api/chats/${chatId}/messages`);
    return response.data; // Expected: { message: "...", message: [...] }
}

export async function sendMessage({ message, chatId, images }) {
    const response = await api.post("/api/chats/message", {
        message,
        chat: chatId,
        images,
    });
    return response.data; // Expected: { title, chat, userMessage, aiMessage }
}

export async function deleteChat(chatId) {
    const response = await api.delete(`/api/chats/delete/${chatId}`);
    return response.data; // Expected: { message: "..." }
}

export async function archiveChat(chatId) {
    const response = await api.patch(`/api/chats/${chatId}/archive`);
    return response.data; // Expected: { message: "...", chat: {...} }
}
