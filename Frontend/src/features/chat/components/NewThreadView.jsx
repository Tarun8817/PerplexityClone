import React from "react";
import ChatInput from "./ChatInput";
import { Sparkles, Brain, Cpu, Compass } from "lucide-react";

const suggestions = [
    {
        title: "Explain quantum computing",
        subtitle: "in extremely simple terms",
        icon: Sparkles,
        color: "text-blue-500",
        bg: "bg-blue-50",
        border: "hover:border-blue-200",
        prompt: "Explain quantum computing in extremely simple terms with examples",
    },
    {
        title: "Electric vs hybrid cars",
        subtitle: "market analysis for 2026",
        icon: Cpu,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        border: "hover:border-emerald-200",
        prompt: "Compare electric cars vs hybrid cars in 2026. What are the key pros and cons?",
    },
    {
        title: "Write a React hook",
        subtitle: "for syncing local storage",
        icon: Brain,
        color: "text-purple-500",
        bg: "bg-purple-50",
        border: "hover:border-purple-200",
        prompt: "Write a clean and robust React hook for local storage synchronization",
    },
    {
        title: "Plan a trip to Tokyo",
        subtitle: "3-day high-efficiency itinerary",
        icon: Compass,
        color: "text-rose-500",
        bg: "bg-rose-50",
        border: "hover:border-rose-200",
        prompt: "Plan a 3-day high-efficiency travel itinerary for Tokyo focusing on culture and technology",
    },
];

const NewThreadView = ({ onSend, sending }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Good morning.";
        if (hour >= 12 && hour < 17) return "Good afternoon.";
        return "Good evening.";
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto px-4 pb-20 select-none animate-in fade-in duration-300">
            {/* Tagline Heading */}
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--color-on-background)]">
                    {getGreeting()}{" "}
                    <span className="text-[var(--color-text-muted)] block mt-2 text-2xl md:text-3xl font-normal">
                        What would you like to know?
                    </span>
                </h1>
            </div>

            {/* Centered Large Chat Input */}
            <div className="w-full mb-10">
                <ChatInput onSend={onSend} sending={sending} />
            </div>

            {/* Suggested Prompts Grid */}
            <div className="w-full max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                    {suggestions.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={idx}
                                onClick={() => onSend(item.prompt)}
                                className={`flex items-start gap-4 p-4 rounded-lg bg-[var(--color-surface-container-lowest)] border border-[var(--color-border-subtle)] ${item.border} text-left transition-all duration-200 cursor-pointer hover:shadow-sm group`}
                            >
                                <div className={`p-2.5 rounded-md shrink-0 ${item.bg}`}>
                                    <Icon size={18} className={item.color} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-medium text-[var(--color-on-background)] group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1 truncate">
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
