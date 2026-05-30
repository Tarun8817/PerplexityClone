import React, { useState, useRef, useEffect } from "react";
import {
    ArrowUp,
    Paperclip,
    Globe,
    PenTool,
    GraduationCap,
    Video,
    MessageCircle,
    ChevronDown,
    Zap,
} from "lucide-react";

const focusOptions = [
    { id: "all", label: "All", icon: Globe, description: "Search across the entire internet" },
    { id: "writing", label: "Writing", icon: PenTool, description: "Generate text and code without web search" },
    { id: "academic", label: "Academic", icon: GraduationCap, description: "Search in peer-reviewed scientific papers" },
    { id: "youtube", label: "YouTube", icon: Video, description: "Find and search inside video content" },
    { id: "reddit", label: "Reddit", icon: MessageCircle, description: "Search discussions and opinions" },
];

const ChatInput = ({ onSend, sending, placeholder = "Ask anything..." }) => {
    const [inputValue, setInputValue] = useState("");
    const [copilot, setCopilot] = useState(false);
    const [selectedFocus, setSelectedFocus] = useState(focusOptions[0]);
    const [focusDropdownOpen, setFocusDropdownOpen] = useState(false);
    
    const textareaRef = useRef(null);
    const dropdownRef = useRef(null);

    // Auto grow textarea height
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
        }
    }, [inputValue]);

    // Handle outer click to close focus dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setFocusDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (inputValue.trim() && !sending) {
            onSend(inputValue.trim());
            setInputValue("");
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };

    const ActiveFocusIcon = selectedFocus.icon;

    return (
        <div className="w-full relative bg-[#1A1C1C] border border-[#2B2E2E] focus-within:border-[#31b8c6] rounded-2xl p-3 shadow-xl transition-all duration-200">
            {/* Input Text Area */}
            <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={1}
                className="w-full bg-transparent text-[#E3E3E2] placeholder-[#7F8484] focus:outline-none resize-none min-h-[44px] max-h-[240px] text-[15px] leading-relaxed pr-12 pb-2"
                style={{ scrollbarWidth: "thin" }}
            />

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#252828] select-none">
                <div className="flex items-center gap-3">
                    {/* Focus Filter Trigger */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setFocusDropdownOpen(!focusDropdownOpen)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#252828] text-gray-400 hover:text-gray-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                            <ActiveFocusIcon size={14} className="text-[#31b8c6]" />
                            <span>Focus: {selectedFocus.label}</span>
                            <ChevronDown size={12} className="text-gray-500" />
                        </button>

                        {/* Focus Dropdown Menu */}
                        {focusDropdownOpen && (
                            <div className="absolute left-0 bottom-full mb-2 w-72 bg-[#1C1F1F] border border-[#2B2E2E] rounded-xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                                {focusOptions.map((opt) => {
                                    const Icon = opt.icon;
                                    const isSelected = opt.id === selectedFocus.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedFocus(opt);
                                                setFocusDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                                isSelected
                                                    ? "bg-[#252828] text-white"
                                                    : "text-gray-400 hover:bg-[#222424] hover:text-gray-200"
                                            }`}
                                        >
                                            <div className={`p-1.5 rounded-md mt-0.5 ${
                                                isSelected ? "bg-cyan-950 text-[#31b8c6]" : "bg-neutral-800 text-gray-400"
                                            }`}>
                                                <Icon size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold leading-none mb-1">{opt.label}</p>
                                                <p className="text-[10px] text-gray-500 font-medium leading-tight">{opt.description}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Mock Attachment trigger */}
                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-[#252828] text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                        title="Attach file (PDF, TXT, images)"
                    >
                        <Paperclip size={14} />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {/* Premium Pro / Copilot Toggle */}
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-500 tracking-wider">COPILOT</span>
                        <button
                            type="button"
                            onClick={() => setCopilot(!copilot)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-250 cursor-pointer outline-none ${
                                copilot ? "bg-[#31b8c6]" : "bg-[#2B2E2E]"
                            }`}
                        >
                            <div
                                className={`w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-md transform transition-transform duration-250 ${
                                    copilot ? "translate-x-4" : "translate-x-0"
                                }`}
                            >
                                {copilot && <Zap size={8} className="text-[#31b8c6] fill-[#31b8c6]" />}
                            </div>
                        </button>
                    </div>

                    {/* Send Button */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!inputValue.trim() || sending}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-black font-bold transition-all duration-200 ${
                            inputValue.trim() && !sending
                                ? "bg-[#31b8c6] text-black shadow-lg shadow-[#31b8c6]/20 hover:scale-105 active:scale-95 cursor-pointer"
                                : "bg-[#2B2E2E] text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        <ArrowUp size={16} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
