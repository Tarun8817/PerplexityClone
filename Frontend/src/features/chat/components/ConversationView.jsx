import React, { useRef, useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import {
    Sparkles,
    User,
    Check,
    Copy,
    ThumbsUp,
    ThumbsDown,
    Share2,
    RotateCw,
    ExternalLink,
    Search,
    BookOpen,
    Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Helper to render beautiful content block by block (ReactMarkdown + GFM tables)
const FormattedAnswer = ({ text }) => {
    if (!text) return null;

    return (
        <div className="prose prose-invert max-w-none text-gray-200 text-[15px] leading-relaxed font-sans select-text">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({ node, ...props }) => <p className="text-gray-300 mb-4 last:mb-0 leading-relaxed" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-extrabold text-gray-100 mt-6 mb-3 border-b border-[#252828] pb-1" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-gray-100 mt-5 mb-2.5 border-b border-[#252828] pb-1" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-gray-100 mt-4.5 mb-2" {...props} />,
                    h4: ({ node, ...props }) => <h4 className="text-base font-bold text-gray-100 mt-4 mb-2" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside pl-4 text-gray-300 space-y-1 mb-4" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside pl-4 text-gray-300 space-y-1 mb-4" {...props} />,
                    li: ({ node, ...props }) => <li className="marker:text-cyan-400" {...props} />,
                    code: ({ node, inline, ...props }) => {
                        return inline ? (
                            <code className="bg-[#1C1F1F] px-1.5 py-0.5 rounded text-[#31b8c6] text-xs font-mono font-bold" {...props} />
                        ) : (
                            <pre className="bg-[#1A1C1C] border border-[#2B2E2E] rounded-xl p-4 overflow-x-auto my-4 text-xs font-mono text-cyan-100 shadow-md">
                                <code {...props} />
                            </pre>
                        );
                    },
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-5 rounded-xl border border-[#2B2E2E] bg-[#161818]/60 shadow-lg">
                            <table className="min-w-full divide-y divide-[#2B2E2E] text-left text-xs text-gray-300" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => <thead className="bg-[#1A1C1C] text-[11px] font-bold text-[#31b8c6] uppercase tracking-wider" {...props} />,
                    tbody: ({ node, ...props }) => <tbody className="divide-y divide-[#232626]" {...props} />,
                    tr: ({ node, ...props }) => <tr className="hover:bg-[#1C1F1F]/40 transition-colors" {...props} />,
                    th: ({ node, ...props }) => <th className="px-4 py-3 font-semibold border-b border-[#2B2E2E]" {...props} />,
                    td: ({ node, ...props }) => <td className="px-4 py-3.5 leading-relaxed" {...props} />,
                }}
            >
                {text}
            </ReactMarkdown>
        </div>
    );
};

const ConversationView = ({
    messages,
    sending,
    onSend,
}) => {
    const bottomRef = useRef(null);
    const [copiedIndex, setCopiedIndex] = useState(null);

    // Scroll to bottom on updates
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, sending]);

    const handleCopy = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Simulate realistic source citations matching the content topic
    const getSourcesForPrompt = (content) => {
        const lower = (content || "").toLowerCase();
        if (lower.includes("quantum")) {
            return [
                { name: "IBM Quantum Research", url: "https://ibm.com/quantum", site: "ibm.com" },
                { name: "Nature Physics Paper", url: "https://nature.com", site: "nature.com" },
                { name: "MIT Tech Review", url: "https://technologyreview.com", site: "technologyreview.com" },
            ];
        } else if (lower.includes("car") || lower.includes("hybrid")) {
            return [
                { name: "Bloomberg Green", url: "https://bloomberg.com", site: "bloomberg.com" },
                { name: "EPA EV Reports 2026", url: "https://epa.gov", site: "epa.gov" },
                { name: "Car and Driver", url: "https://caranddriver.com", site: "caranddriver.com" },
            ];
        } else if (lower.includes("react") || lower.includes("hook") || lower.includes("storage")) {
            return [
                { name: "React official docs", url: "https://react.dev", site: "react.dev" },
                { name: "MDN Web Storage API", url: "https://developer.mozilla.org", site: "mozilla.org" },
                { name: "Jack Herrington Guide", url: "https://youtube.com", site: "youtube.com" },
            ];
        }
        return [
            { name: "Google Search Engine", url: "https://google.com", site: "google.com" },
            { name: "Wikipedia Knowledge Graph", url: "https://wikipedia.org", site: "wikipedia.org" },
            { name: "ArXiv Scientific Database", url: "https://arxiv.org", site: "arxiv.org" },
        ];
    };

    // Suggest logical related questions
    const getRelatedQuestions = (lastMessage) => {
        const content = lastMessage ? lastMessage.content.toLowerCase() : "";
        if (content.includes("quantum")) {
            return [
                "What is quantum entanglement?",
                "What are qubits made of?",
                "When will quantum computers be commercially available?",
            ];
        } else if (content.includes("car") || content.includes("hybrid")) {
            return [
                "Which brand makes the best hybrid car?",
                "What is the average battery degradation of EVs?",
                "How much cheaper is it to charge than fuel?",
            ];
        } else if (content.includes("react") || content.includes("hook")) {
            return [
                "How do I handle Server Side Rendering (SSR) with local storage?",
                "Can I trigger callbacks when local storage changes in other tabs?",
                "Provide an example usage of this custom hook.",
            ];
        }
        return [
            "Can you explain that in more detail?",
            "What are the major limitations of this approach?",
            "Give me some practical real-life examples.",
        ];
    };

    // Find the last user message to generate context sources and follow-ups
    const getLastUserMessage = () => {
        const userMsgs = messages.filter((m) => m.role === "user");
        return userMsgs[userMsgs.length - 1] || null;
    };

    const lastUserMsg = getLastUserMessage();
    const activeSources = lastUserMsg ? getSourcesForPrompt(lastUserMsg.content) : [];
    const relatedQuestions = lastUserMsg ? getRelatedQuestions(lastUserMsg) : [];

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#131515]">
            {/* Scrollable Conversation Box */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-8 select-text scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                <div className="max-w-3xl w-full mx-auto space-y-8">
                    {messages.map((msg, idx) => {
                        const isUser = msg.role === "user";

                        return (
                            <div
                                key={msg._id || idx}
                                className={`flex items-start gap-4 animate-in fade-in duration-200 ${
                                    isUser ? "border-b border-[#1A1C1C] pb-4" : ""
                                }`}
                            >
                                {/* Left Side Icon / Avatar */}
                                <div className="shrink-0 mt-0.5">
                                    {isUser ? (
                                        <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-gray-300">
                                            <User size={14} />
                                        </div>
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                                            <Sparkles size={14} className="fill-cyan-400/20" />
                                        </div>
                                    )}
                                </div>

                                {/* Content and Subsystems */}
                                <div className="flex-1 space-y-4">
                                     {/* Sender Header */}
                                     <div className="flex items-center gap-2">
                                         <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                             {isUser ? "You" : "Answer"}
                                         </div>
                                         {isUser && msg._id && msg._id.toString().startsWith("temp-user-") && sending && (
                                             <span className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold uppercase tracking-wider animate-pulse select-none bg-cyan-950/20 px-2 py-0.5 rounded-full border border-cyan-800/30">
                                                 <Loader2 size={10} className="animate-spin text-cyan-400" />
                                                 <span>Sending</span>
                                             </span>
                                         )}
                                     </div>

                                    {/* Main Body content */}
                                    <div className="text-gray-100 font-sans">
                                        {isUser ? (
                                            <div className="space-y-2">
                                                {msg.images && msg.images.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {msg.images.map((img, imgIdx) => (
                                                            <div key={imgIdx} className="relative rounded-lg overflow-hidden border border-[#2B2E2E] shadow-sm max-w-[200px] bg-[#1C1F1F]">
                                                                <img
                                                                    src={img}
                                                                    alt={`Attachment ${imgIdx + 1}`}
                                                                    className="max-h-36 object-cover rounded-lg hover:scale-[1.03] transition-transform duration-200"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {msg.content && (
                                                    <p className="text-base font-semibold leading-relaxed text-gray-200">
                                                        {msg.content}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                {/* Sources Citation Bar (Perplexity style) - displayed BEFORE AI content */}
                                                {idx === messages.length - 1 && activeSources.length > 0 && (
                                                    <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                                                            <Search size={12} className="text-cyan-400" />
                                                            <span>Sources Found</span>
                                                        </div>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                            {activeSources.map((src, sIdx) => (
                                                                <a
                                                                    key={sIdx}
                                                                    href={src.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2 p-2 rounded-lg bg-[#1A1C1C] border border-[#222424] hover:border-cyan-500/20 text-xs font-medium text-gray-300 hover:text-cyan-400 transition-all select-none"
                                                                >
                                                                    <div className="w-4 h-4 rounded bg-zinc-800 flex items-center justify-center text-[10px] text-cyan-400 font-bold shrink-0">
                                                                        {sIdx + 1}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="truncate text-gray-200 font-semibold leading-none mb-0.5">
                                                                            {src.name}
                                                                        </p>
                                                                        <p className="text-[9px] text-gray-500 truncate leading-none">
                                                                            {src.site}
                                                                        </p>
                                                                    </div>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <FormattedAnswer text={msg.content} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Row for AI replies */}
                                    {!isUser && (
                                        <div className="flex items-center gap-4 text-gray-500 pt-2 select-none border-t border-[#1C1F1F]">
                                            <button
                                                onClick={() => handleCopy(msg.content, idx)}
                                                className="p-1 hover:bg-[#202222] rounded transition-colors text-gray-500 hover:text-gray-300"
                                                title="Copy to clipboard"
                                            >
                                                {copiedIndex === idx ? (
                                                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                                                        <Check size={14} />
                                                        <span>Copied!</span>
                                                    </span>
                                                ) : (
                                                    <Copy size={14} />
                                                )}
                                            </button>
                                            <button className="p-1 hover:bg-[#202222] rounded transition-colors hover:text-[#31b8c6]" title="Helpful">
                                                <ThumbsUp size={14} />
                                            </button>
                                            <button className="p-1 hover:bg-[#202222] rounded transition-colors hover:text-red-400" title="Not helpful">
                                                <ThumbsDown size={14} />
                                            </button>
                                            <button className="p-1 hover:bg-[#202222] rounded transition-colors hover:text-gray-300" title="Share thread">
                                                <Share2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* AI Loading/Responding Animation */}
                    {sending && (
                        <div className="flex items-start gap-4 animate-pulse">
                            <div className="shrink-0 mt-0.5">
                                <div className="w-7 h-7 rounded-full bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                                    <Sparkles size={14} className="animate-spin text-[#31b8c6]" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Perplexity thinking
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-[#1A1C1C] rounded w-11/12" />
                                    <div className="h-4 bg-[#1A1C1C] rounded w-5/6" />
                                    <div className="h-4 bg-[#1A1C1C] rounded w-2/3" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Related Follow-Ups Recommendations Section */}
                    {!sending && messages.length > 0 && messages[messages.length - 1].role === "ai" && (
                        <div className="pt-4 border-t border-[#1C1F1F] space-y-3 select-none animate-in fade-in duration-300">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold uppercase tracking-wider">
                                <BookOpen size={12} className="text-teal-400" />
                                <span>Related Questions</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {relatedQuestions.map((q, qIdx) => (
                                    <button
                                        key={qIdx}
                                        onClick={() => onSend(q)}
                                        className="w-full text-left p-2.5 rounded-lg border border-[#222424] hover:border-cyan-500/20 bg-[#1A1C1C]/40 hover:bg-[#1A1C1C] text-sm text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer"
                                    >
                                        {q} →
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div ref={bottomRef} className="h-10" />
                </div>
            </div>

            {/* Reusable ChatInput Sticky Follow-Up at bottom */}
            <div className="p-4 border-t border-[#1A1C1C] bg-[#0E1010]/80 backdrop-blur-md shrink-0">
                <div className="max-w-3xl w-full mx-auto">
                    <ChatInput onSend={onSend} sending={sending} placeholder="Ask a follow-up..." />
                </div>
            </div>
        </div>
    );
};

export default ConversationView;
