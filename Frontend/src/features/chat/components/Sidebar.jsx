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
    ArchiveRestore,
    Moon,
    Sun
} from "lucide-react";
import { useAuth } from "../../auth/hook/useAuth";
import { useTheme } from "../../../app/ThemeContext";

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
    const { theme, toggleTheme } = useTheme();
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
                <div className="text-xs text-[var(--color-text-muted)] italic px-3 py-4">
                    No threads found
                </div>
            );
        }

        return chatList.map((chat) => {
            const isActive = activeChatId === chat._id;
            return (
                <div
                    key={chat._id}
                    className={`relative group flex items-center justify-between rounded-md transition-all duration-150 ${isActive
                            ? "bg-[var(--color-surface-variant)] text-[var(--color-on-background)]"
                            : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-background)]"
                        }`}
                    onMouseEnter={() => setHoveredChatId(chat._id)}
                    onMouseLeave={() => setHoveredChatId(null)}
                >
                    <button
                        onClick={() => onSelectChat(chat._id)}
                        className="flex-1 flex items-center gap-3 px-3 py-2 text-left text-sm truncate rounded-md cursor-pointer"
                    >
                        <MessageSquare size={16} className={`shrink-0 ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]'}`} />
                        {!isCollapsed && (
                            <span className="truncate pr-4 font-medium">{chat.title || "Untitled Thread"}</span>
                        )}
                    </button>

                    {!isCollapsed && hoveredChatId === chat._id && (
                        <div className="absolute right-2 flex items-center gap-1 bg-gradient-to-l from-[var(--color-surface-container)] pl-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onArchiveChat(chat._id);
                                }}
                                className="p-1 rounded hover:bg-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                                title={isArchivedSection ? "Unarchive thread" : "Archive thread"}
                            >
                                {isArchivedSection ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteChat(chat._id);
                                }}
                                className="p-1 rounded hover:bg-[var(--color-error-container)] text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors"
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
            className={`h-screen flex flex-col bg-[var(--color-surface-off-white)] border-r border-[var(--color-border-subtle)] text-[var(--color-on-background)] transition-all duration-300 ease-in-out select-none ${isCollapsed ? "w-16" : "w-64"
                }`}
        >
            {/* Top Brand Logo Section */}
            <div className="p-4 flex items-center justify-between border-b border-[var(--color-border-subtle)] h-16 shrink-0">
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[var(--color-primary)] flex items-center justify-center">
                            <span className="text-[12px] font-bold text-[var(--color-on-primary)]">P</span>
                        </div>
                        <span className="font-semibold text-lg tracking-tight text-[var(--color-primary)]">
                            Perplexity
                        </span>
                    </div>
                )}
                {isCollapsed && (
                    <div className="w-8 h-8 rounded-md bg-[var(--color-primary)] flex items-center justify-center mx-auto">
                        <span className="text-sm font-bold text-[var(--color-on-primary)]">P</span>
                    </div>
                )}

                {!isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="p-1 hover:bg-[var(--color-surface-container)] rounded-md transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
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
                    className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md border border-[var(--color-border-subtle)] hover:border-[var(--color-outline)] bg-[var(--color-surface-container-lowest)] hover:bg-[var(--color-surface-container-low)] text-[var(--color-primary)] font-medium text-sm transition-all duration-200 cursor-pointer shadow-sm`}
                >
                    <Plus size={18} />
                    {!isCollapsed && <span>New Thread</span>}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="px-3 space-y-1 shrink-0">
                <button
                    onClick={onNewThread}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 cursor-pointer ${!activeChatId
                            ? "bg-[var(--color-surface-variant)] text-[var(--color-on-background)] font-medium"
                            : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-background)]"
                        }`}
                >
                    <Home size={18} />
                    {!isCollapsed && <span>Home</span>}
                </button>
            </nav>

            {/* Recent Threads List */}
            <div className="flex-1 flex flex-col overflow-y-auto px-3 py-4 mt-2 scrollbar-thin scrollbar-thumb-[var(--color-surface-variant)] scrollbar-track-transparent">
                {!isCollapsed && (
                    <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-2 mb-3">
                        Recent Threads
                    </div>
                )}
                
                <div className="space-y-1 mb-6">
                    {renderChatList(activeChats, false)}
                </div>

                {/* Archived Threads Section */}
                {!isCollapsed && archivedChats.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-[var(--color-border-subtle)]">
                        <button 
                            onClick={() => setShowArchived(!showArchived)}
                            className="flex items-center justify-between w-full text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] uppercase tracking-wider px-2 mb-3 transition-colors cursor-pointer"
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
                <div className="p-3 border-t border-[var(--color-border-subtle)] flex justify-center shrink-0">
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="p-1.5 hover:bg-[var(--color-surface-container)] rounded-md transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                        title="Expand sidebar"
                    >
                        <PanelLeft size={18} />
                    </button>
                </div>
            )}

            {/* Footer Profile Section */}
            <div className="p-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-off-white)] shrink-0">
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] flex items-center justify-center font-bold text-xs shrink-0">
                        {getInitials(user?.username || user?.email)}
                    </div>

                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--color-on-background)] truncate leading-none mb-1">
                                {user?.username || "Guest User"}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)] truncate leading-none">
                                {user?.email}
                            </p>
                        </div>
                    )}

                    {!isCollapsed && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={toggleTheme}
                                className="p-1.5 hover:bg-[var(--color-surface-container)] rounded-md transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-primary)] cursor-pointer"
                                title="Toggle Theme"
                            >
                                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-1.5 hover:bg-[var(--color-surface-container)] rounded-md transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-error)] cursor-pointer"
                                title="Sign out"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
