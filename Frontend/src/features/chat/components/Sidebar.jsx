import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Plus,
    MessageSquare,
    Trash2,
    LogOut,
    PanelLeftClose,
    PanelLeft,
    Home,
    Archive,
    ArchiveRestore
} from "lucide-react";
import { useAuth } from "../../auth/hook/useAuth";

const Sidebar = ({
    chats,
    activeChatId,
    onSelectChat,
    onNewThread,
    onDeleteChat,
    onArchiveChat,
    isCollapsed,
    setIsCollapsed,
}) => {
    const { handleLogout } = useAuth();
    const { user } = useSelector((state) => state.auth);
    const [hoveredChatId, setHoveredChatId] = useState(null);
    const [showArchived, setShowArchived] = useState(false);

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const activeChats = chats.filter(c => !c.isArchived);
    const archivedChats = chats.filter(c => c.isArchived);

    const renderChatList = (chatList, isArchivedSection = false) => {
        if (chatList.length === 0 && !isCollapsed) {
            return (
                <div className="text-xs text-[var(--color-secondary)] italic px-3 py-4">
                    No threads found
                </div>
            );
        }

        return chatList.map((chat) => {
            const isActive = activeChatId === chat._id;
            return (
                <div
                    key={chat._id}
                    className={`relative group flex items-center justify-between rounded-lg transition-all duration-150 ${isActive
                            ? "bg-[var(--color-base-lighter)] text-white"
                            : "text-[var(--color-primary)] hover:bg-[var(--color-base-darker)] hover:text-white"
                        }`}
                    onMouseEnter={() => setHoveredChatId(chat._id)}
                    onMouseLeave={() => setHoveredChatId(null)}
                >
                    <button
                        onClick={() => onSelectChat(chat._id)}
                        className="flex-1 flex items-center gap-3 px-3 py-2 text-left text-sm truncate rounded-lg cursor-pointer"
                    >
                        <MessageSquare size={16} className={`shrink-0 ${isActive ? 'text-white' : 'text-[var(--color-secondary)] group-hover:text-gray-300'}`} />
                        {!isCollapsed && (
                            <span className="truncate pr-4 font-medium">{chat.title || "Untitled Thread"}</span>
                        )}
                    </button>

                    {!isCollapsed && hoveredChatId === chat._id && (
                        <div className="absolute right-2 flex items-center gap-1 bg-gradient-to-l from-[var(--color-base-darker)] pl-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onArchiveChat(chat._id);
                                }}
                                className="p-1.5 rounded hover:bg-[var(--color-base-lighter)] text-[var(--color-secondary)] hover:text-white transition-colors"
                                title={isArchivedSection ? "Unarchive thread" : "Archive thread"}
                            >
                                {isArchivedSection ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteChat(chat._id);
                                }}
                                className="p-1.5 rounded hover:bg-red-950/30 text-[var(--color-secondary)] hover:text-red-400 transition-colors"
                                title="Delete thread"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <aside
            className={`h-screen flex flex-col bg-[var(--color-base-darker)] border-r border-[var(--color-base-lighter)] text-[var(--color-primary)] transition-all duration-300 ease-in-out select-none ${isCollapsed ? "w-16" : "w-64"
                }`}
        >
            {/* Top Brand Logo Section */}
            <div className="p-4 flex items-center justify-between border-b border-[var(--color-base-lighter)] h-16 shrink-0">
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[var(--color-primary)] flex items-center justify-center">
                            <span className="text-[12px] font-bold text-[var(--color-base-darker)]">P</span>
                        </div>
                        <span className="font-semibold text-lg tracking-tight text-white">
                            Perplexity
                        </span>
                    </div>
                )}
                {isCollapsed && (
                    <div className="w-8 h-8 rounded-md bg-[var(--color-primary)] flex items-center justify-center mx-auto">
                        <span className="text-sm font-bold text-[var(--color-base-darker)]">P</span>
                    </div>
                )}

                {!isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="p-1 hover:bg-[var(--color-base)] rounded-md transition-colors text-[var(--color-secondary)] hover:text-white"
                        title="Collapse sidebar"
                    >
                        <PanelLeftClose size={18} />
                    </button>
                )}
            </div>

            {/* Main Action: New Thread */}
            <div className="p-4 shrink-0">
                <button
                    onClick={onNewThread}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[var(--color-base-lighter)] hover:border-gray-500 bg-[var(--color-base)] hover:bg-[var(--color-base-lighter)] text-white font-medium text-sm transition-all duration-200 cursor-pointer shadow-sm`}
                >
                    <Plus size={18} />
                    {!isCollapsed && <span>New Thread</span>}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="px-3 space-y-1 shrink-0">
                <button
                    onClick={onNewThread}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer ${!activeChatId
                            ? "bg-[var(--color-base-lighter)] text-white font-medium"
                            : "text-[var(--color-secondary)] hover:bg-[var(--color-base)] hover:text-white"
                        }`}
                >
                    <Home size={18} />
                    {!isCollapsed && <span>Home</span>}
                </button>
            </nav>

            {/* Recent Threads List */}
            <div className="flex-1 flex flex-col overflow-y-auto px-3 py-4 mt-2 scrollbar-thin scrollbar-thumb-[var(--color-base-lighter)] scrollbar-track-transparent">
                {!isCollapsed && (
                    <div className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-wider px-2 mb-3">
                        Recent Threads
                    </div>
                )}
                
                <div className="space-y-1 mb-6">
                    {renderChatList(activeChats, false)}
                </div>

                {/* Archived Threads Section */}
                {!isCollapsed && archivedChats.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-[var(--color-base-lighter)]">
                        <button 
                            onClick={() => setShowArchived(!showArchived)}
                            className="flex items-center justify-between w-full text-xs font-semibold text-[var(--color-secondary)] hover:text-white uppercase tracking-wider px-2 mb-3 transition-colors cursor-pointer"
                        >
                            <span>Archived ({archivedChats.length})</span>
                            <Archive size={14} />
                        </button>
                        
                        {showArchived && (
                            <div className="space-y-1">
                                {renderChatList(archivedChats, true)}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Sidebar Toggle in Collapsed Mode */}
            {isCollapsed && (
                <div className="p-3 border-t border-[var(--color-base-lighter)] flex justify-center shrink-0">
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="p-1.5 hover:bg-[var(--color-base)] rounded-md transition-colors text-[var(--color-secondary)] hover:text-white"
                        title="Expand sidebar"
                    >
                        <PanelLeft size={18} />
                    </button>
                </div>
            )}

            {/* Footer Profile Section */}
            <div className="p-4 border-t border-[var(--color-base-lighter)] bg-[var(--color-base)] shrink-0">
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-600 to-gray-400 text-white flex items-center justify-center font-bold text-xs shadow-md shrink-0">
                        {getInitials(user?.username || user?.email)}
                    </div>

                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate leading-none mb-1">
                                {user?.username || "Guest User"}
                            </p>
                            <p className="text-xs text-[var(--color-secondary)] truncate leading-none">
                                {user?.email}
                            </p>
                        </div>
                    )}

                    {!isCollapsed && (
                        <button
                            onClick={handleLogout}
                            className="p-1.5 hover:bg-[var(--color-base-lighter)] rounded-md transition-colors text-[var(--color-secondary)] hover:text-red-400 cursor-pointer"
                            title="Sign out"
                        >
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
