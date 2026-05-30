import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Plus,
    Compass,
    Library,
    MessageSquare,
    Trash2,
    Settings,
    LogOut,
    PanelLeftClose,
    PanelLeft,
    CompassIcon,
    Home,
} from "lucide-react";
import { useAuth } from "../../auth/hook/useAuth";

const Sidebar = ({
    chats,
    activeChatId,
    onSelectChat,
    onNewThread,
    onDeleteChat,
    isCollapsed,
    setIsCollapsed,
}) => {
    const { handleLogout } = useAuth();
    const { user } = useSelector((state) => state.auth);
    const [hoveredChatId, setHoveredChatId] = useState(null);

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <aside
            className={`h-screen flex flex-col bg-[#0F1111] border-r border-[#222424] text-[#E3E3E2] transition-all duration-300 ease-in-out select-none ${isCollapsed ? "w-16" : "w-64"
                }`}
        >
            {/* Top Brand Logo Section */}
            <div className="p-4 flex items-center justify-between border-b border-[#222424] h-16 shrink-0">
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <span className="text-[11px] font-black text-black">P</span>
                        </div>
                        <span className="font-extrabold text-lg tracking-wide bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                            perplexity
                        </span>
                    </div>
                )}
                {isCollapsed && (
                    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
                        <span className="text-xs font-black text-black">P</span>
                    </div>
                )}

                {!isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="p-1 hover:bg-[#202222] rounded transition-colors text-gray-400 hover:text-white"
                        title="Collapse sidebar"
                    >
                        <PanelLeftClose size={18} />
                    </button>
                )}
            </div>

            {/* Main Action: New Thread */}
            <div className="p-3 shrink-0">
                <button
                    onClick={onNewThread}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full border border-[#31b8c6]/30 hover:border-[#31b8c6] bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[#31b8c6]/10 active:scale-98`}
                >
                    <Plus size={18} />
                    {!isCollapsed && <span>New Thread</span>}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="px-2 space-y-1 shrink-0">
                <button
                    onClick={onNewThread}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer ${!activeChatId
                            ? "bg-[#202222] text-[#31b8c6] font-semibold"
                            : "text-gray-400 hover:bg-[#1A1C1C] hover:text-gray-200"
                        }`}
                >
                    <Home size={18} />
                    {!isCollapsed && <span>Home</span>}
                </button>
                {/* <button
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-[#1A1C1C] hover:text-gray-200 transition-all duration-200 cursor-pointer"
                >
                    <Compass size={18} />
                    {!isCollapsed && <span>Discover</span>}
                </button>
                <button
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-[#1A1C1C] hover:text-gray-200 transition-all duration-200 cursor-pointer"
                >
                    <Library size={18} />
                    {!isCollapsed && <span>Library</span>}
                </button> */}
            </nav>

            {/* Recent Threads List */}
            <div className="flex-1 overflow-y-auto px-2 py-4 border-t border-[#222424] mt-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                {!isCollapsed && (
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                        Recent Threads
                    </div>
                )}
                <div className="space-y-1">
                    {chats.map((chat) => {
                        const isActive = activeChatId === chat._id;
                        return (
                            <div
                                key={chat._id}
                                className={`relative group flex items-center justify-between rounded-lg transition-all duration-150 ${isActive
                                        ? "bg-[#202222] text-white"
                                        : "text-gray-400 hover:bg-[#1A1C1C] hover:text-gray-200"
                                    }`}
                                onMouseEnter={() => setHoveredChatId(chat._id)}
                                onMouseLeave={() => setHoveredChatId(null)}
                            >
                                <button
                                    onClick={() => onSelectChat(chat._id)}
                                    className="flex-1 flex items-center gap-3 px-3 py-2 text-left text-sm truncate rounded-lg cursor-pointer"
                                >
                                    <MessageSquare size={16} className="shrink-0 text-gray-500 group-hover:text-gray-300" />
                                    {!isCollapsed && (
                                        <span className="truncate pr-4">{chat.title || "Untitled Thread"}</span>
                                    )}
                                </button>

                                {!isCollapsed && hoveredChatId === chat._id && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteChat(chat._id);
                                        }}
                                        className="absolute right-2 p-1 rounded hover:bg-red-950/30 text-gray-500 hover:text-red-400 transition-colors"
                                        title="Delete thread"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        );
                    })}

                    {chats.length === 0 && !isCollapsed && (
                        <div className="text-xs text-gray-500 italic px-3 py-4">
                            No threads yet
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Toggle in Collapsed Mode */}
            {isCollapsed && (
                <div className="p-3 border-t border-[#222424] flex justify-center shrink-0">
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="p-1.5 hover:bg-[#202222] rounded transition-colors text-gray-400 hover:text-white"
                        title="Expand sidebar"
                    >
                        <PanelLeft size={18} />
                    </button>
                </div>
            )}

            {/* Footer Profile Section */}
            <div className="p-3 border-t border-[#222424] bg-[#0A0B0B] shrink-0">
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#31b8c6] to-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-[#31b8c6]/10 shrink-0">
                        {getInitials(user?.username || user?.email)}
                    </div>

                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-200 truncate leading-none mb-1">
                                {user?.username || "Guest User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate leading-none">
                                {user?.email}
                            </p>
                        </div>
                    )}

                    {!isCollapsed && (
                        <button
                            onClick={handleLogout}
                            className="p-1.5 hover:bg-[#202222] rounded transition-colors text-gray-400 hover:text-red-400 cursor-pointer"
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
