import React from "react";
import ChatInput from "./ChatInput";
import { Sparkles, Brain, Cpu, Compass } from "lucide-react";

const suggestions = [
    {
        title: "Explain quantum computing",
        subtitle: "in extremely simple terms",
        icon: Sparkles,
        color: "text-amber-400",
        bg: "bg-amber-950/10",
        border: "hover:border-amber-500/30",
        prompt: "Explain quantum computing in extremely simple terms with examples",
    },
    {
        title: "Electric vs hybrid cars",
        subtitle: "market analysis for 2026",
        icon: Cpu,
        color: "text-cyan-400",
        bg: "bg-cyan-950/10",
        border: "hover:border-cyan-500/30",
        prompt: "Compare electric cars vs hybrid cars in 2026. What are the key pros and cons?",
    },
    {
        title: "Write a React hook",
        subtitle: "for syncing local storage",
        icon: Brain,
        color: "text-emerald-400",
        bg: "bg-emerald-950/10",
        border: "hover:border-emerald-500/30",
        prompt: "Write a clean and robust React hook for local storage synchronization",
    },
    {
        title: "Plan a trip to Tokyo",
        subtitle: "3-day high-efficiency itinerary",
        icon: Compass,
        color: "text-rose-400",
        bg: "bg-rose-950/10",
        border: "hover:border-rose-500/30",
        prompt: "Plan a 3-day high-efficiency travel itinerary for Tokyo focusing on culture and technology",
    },
];

const NewThreadView = ({ onSend, sending }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto px-4 pb-20 select-none animate-in fade-in duration-300">
            {/* Tagline Heading */}
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#E3E3E2] font-sans">
                    Where{" "}
                    <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                        knowledge
                    </span>{" "}
                    begins
                </h1>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                    Ask any question, explore topics, and find detailed answers backed by sources.
                </p>
            </div>

            {/* Centered Large Chat Input */}
            <div className="w-full mb-8">
                <ChatInput onSend={onSend} sending={sending} />
            </div>

            {/* Suggested Prompts Grid */}
            <div className="w-full">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
                    Try asking
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                    {suggestions.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={idx}
                                onClick={() => onSend(item.prompt)}
                                className={`flex items-start gap-4 p-4 rounded-xl bg-[#1A1C1C] border border-[#252828] ${item.border} text-left transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg group active:scale-98`}
                            >
                                <div className={`p-2.5 rounded-lg shrink-0 ${item.bg}`}>
                                    <Icon size={18} className={item.color} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors leading-tight">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1 font-medium truncate">
                                        {item.subtitle}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default NewThreadView;
