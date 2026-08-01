import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import Sidebar from "../components/Sidebar";
import NewThreadView from "../components/NewThreadView";
import ConversationView from "../components/ConversationView";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
    const {
        chats,
        activeChatId,
        messages,
        loading,
        sending,
        loadChats,
        loadMessages,
        sendUserMessage,
        createNewThread,
        deleteThread,
        archiveThread,
        initializeSocketConnection,
    } = useChat();

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Initialize sockets and load recent chats
    useEffect(() => {
        initializeSocketConnection();
        loadChats();
    }, [initializeSocketConnection, loadChats]);

    const handleSelectChat = (chatId) => {
        loadMessages(chatId);
    };

    const handleNewThread = () => {
        createNewThread();
    };

    const handleDeleteChat = (chatId) => {
        deleteThread(chatId);
    };

    return (
        <main className="h-screen w-full flex bg-[var(--color-base)] overflow-hidden text-[var(--color-primary)] font-sans">
            {/* Left Collapsible Sidebar */}
            <Sidebar
                chats={chats}
                activeChatId={activeChatId}
                onSelectChat={handleSelectChat}
                onNewThread={handleNewThread}
                onDeleteChat={handleDeleteChat}
                onArchiveChat={(id) => archiveThread(id)}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />

            {/* Main Chat Area */}
            <section className="flex-1 flex flex-col h-full overflow-hidden relative">
                {loading && messages.length === 0 ? (
                    /* Initial Loading State */
                    <div className="flex-1 flex flex-col items-center justify-center bg-[var(--color-base)]">
                        <Loader2 size={36} className="animate-spin text-[#31b8c6] mb-3" />
                        <p className="text-sm text-gray-500 font-semibold tracking-wide">
                            Loading your intelligence threads...
                        </p>
                    </div>
                ) : !activeChatId || messages.length === 0 ? (
                    /* Dashboard Initial Landing State (Where Knowledge Begins) */
                    <div className="flex-1 flex items-center justify-center overflow-y-auto scrollbar-none">
                        <NewThreadView onSend={sendUserMessage} sending={sending} />
                    </div>
                ) : (
                    /* Active Conversational Thread View */
                    <ConversationView
                        messages={messages}
                        sending={sending}
                        onSend={sendUserMessage}
                    />
                )}
            </section>
        </main>
    );
};

export default Dashboard;
