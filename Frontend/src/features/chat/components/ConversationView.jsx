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
    Search,
    BookOpen,
    Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const FormattedAnswer = ({ text }) => {
    if (!text) return null;

    return (
        <div className="prose prose-slate max-w-none text-[var(--color-on-background)] text-[15px] leading-relaxed font-sans select-text">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({ node, ...props }) => <p className="mb-4 last:mb-0 leading-relaxed" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-semibold text-[var(--color-on-background)]" {...props} />,
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-semibold mt-6 mb-3 border-b border-[var(--color-border-subtle)] pb-1" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-5 mb-2.5 border-b border-[var(--color-border-subtle)] pb-1" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4.5 mb-2" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 mb-4" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 mb-4" {...props} />,
                    li: ({ node, ...props }) => <li className="marker:text-[var(--color-text-muted)]" {...props} />,
                    code: ({ node, inline, ...props }) => {
                        return inline ? (
                            <code className="bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded text-[var(--color-primary)] text-[13px] font-mono" {...props} />
                        ) : (
                            <pre className="bg-[var(--color-surface-container-low)] border border-[var(--color-border-subtle)] rounded-lg p-4 overflow-x-auto my-4 text-[13px] font-mono text-[var(--color-on-background)] shadow-sm">
                                <code {...props} />
                            </pre>
                        );
                    },
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-container-lowest)] shadow-sm">
                            <table className="min-w-full divide-y divide-[var(--color-border-subtle)] text-left text-sm" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => <thead className="bg-[var(--color-surface-container-low)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]" {...props} />,
                    tbody: ({ node, ...props }) => <tbody className="divide-y divide-[var(--color-border-subtle)]" {...props} />,
                    tr: ({ node, ...props }) => <tr className="hover:bg-[var(--color-surface-off-white)] transition-colors" {...props} />,
                    th: ({ node, ...props }) => <th className="px-4 py-3 font-semibold border-b border-[var(--color-border-subtle)]" {...props} />,
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

    const getLastUserMessage = () => {
        const userMsgs = messages.filter((m) => m.role === "user");
        return userMsgs[userMsgs.length - 1] || null;
    };

    const lastUserMsg = getLastUserMessage();
    const activeSources = lastUserMsg ? getSourcesForPrompt(lastUserMsg.content) : [];
    const relatedQuestions = lastUserMsg ? getRelatedQuestions(lastUserMsg) : [];

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--color-background)]">
            {/* Scrollable Conversation Box */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-8 select-text scrollbar-thin scrollbar-thumb-[var(--color-surface-container)] scrollbar-track-transparent">
                <div className="max-w-3xl w-full mx-auto space-y-12">
                    {messages.map((msg, idx) => {
                        const isUser = msg.role === "user";

                        return (
                            <div
                                key={msg._id || idx}
                                className={`flex items-start gap-4 animate-in fade-in duration-200`}
                            >
                                {/* Left Side Icon / Avatar */}
                                <div className="shrink-0 mt-0.5">
                                    {isUser ? (
                                        <div className="w-8 h-8 rounded-full bg-[var(--color-surface-container-high)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-on-background)]">
                                            <User size={16} />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-on-primary)] shadow-sm">
                                            <Sparkles size={16} className="fill-[var(--color-on-primary)]" />
                                        </div>
                                    )}
                                </div>

                                {/* Content and Subsystems */}
                                <div className="flex-1 space-y-3">
                                     {/* Sender Header */}
                                     <div className="flex items-center gap-2">
                                         <div className="text-sm font-medium text-[var(--color-on-background)]">
                                             {isUser ? "You" : "Perplexity"}
                                         </div>
                                         {isUser && msg._id && msg._id.toString().startsWith("temp-user-") && sending && (
                                             <span className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider animate-pulse select-none bg-[var(--color-surface-container)] px-2 py-0.5 rounded-full">
                                                 <Loader2 size={10} className="animate-spin text-[var(--color-text-muted)]" />
                                                 <span>Sending</span>
                                             </span>
                                         )}
                                     </div>

                                    {/* Main Body content */}
                                    <div className="font-sans">
                                        {isUser ? (
                                            <div className="space-y-2">
                                                {msg.images && msg.images.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {msg.images.map((img, imgIdx) => (
                                                            <div key={imgIdx} className="relative rounded-lg overflow-hidden border border-[var(--color-border-subtle)] shadow-sm max-w-[200px] bg-[var(--color-surface-container-lowest)]">
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
                                                    <p className="text-lg text-[var(--color-on-background)]">
                                                        {msg.content}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                {/* Sources Citation Bar */}
                                                {idx === messages.length - 1 && activeSources.length > 0 && (
                                                    <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
                                                        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-on-background)] mb-3 border-b border-[var(--color-border-subtle)] pb-2">
                                                            <Search size={16} className="text-[var(--color-text-muted)]" />
                                                            <span>Sources</span>
                                                        </div>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                            {activeSources.map((src, sIdx) => (
                                                                <a
                                                                    key={sIdx}
                                                                    href={src.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex flex-col gap-1 p-3 rounded-lg bg-[var(--color-surface-container-lowest)] border border-[var(--color-border-subtle)] hover:shadow-md transition-all select-none"
                                                                >
                                                                    <p className="truncate text-sm font-medium text-[var(--color-on-background)]">
                                                                        {src.name}
                                                                    </p>
                                                                    <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)]">
                                                                        <div className="w-3.5 h-3.5 rounded bg-[var(--color-surface-container-high)] flex items-center justify-center font-semibold shrink-0">
                                                                            {sIdx + 1}
                                                                        </div>
                                                                        <p className="truncate">
                                                                            {src.site}
                                                                        </p>
                                                                    </div>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-on-background)] mb-3 border-b border-[var(--color-border-subtle)] pb-2">
                                                    <BookOpen size={16} className="text-[var(--color-text-muted)]" />
                                                    <span>Answer</span>
                                                </div>
                                                <FormattedAnswer text={msg.content} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Row for AI replies */}
                                    {!isUser && (
                                        <div className="flex items-center gap-2 text-[var(--color-text-muted)] pt-3 select-none">
                                            <button
                                                onClick={() => handleCopy(msg.content, idx)}
                                                className="p-1.5 hover:bg-[var(--color-surface-container)] rounded-md transition-colors hover:text-[var(--color-primary)]"
                                                title="Copy to clipboard"
                                            >
                                                {copiedIndex === idx ? (
                                                    <span className="flex items-center gap-1 text-xs font-medium">
                                                        <Check size={14} />
                                                        <span>Copied!</span>
                                                    </span>
                                                ) : (
                                                    <Copy size={14} />
                                                )}
                                            </button>
                                            <button className="p-1.5 hover:bg-[var(--color-surface-container)] rounded-md transition-colors hover:text-[var(--color-primary)]" title="Helpful">
                                                <ThumbsUp size={14} />
                                            </button>
                                            <button className="p-1.5 hover:bg-[var(--color-surface-container)] rounded-md transition-colors hover:text-[var(--color-primary)]" title="Not helpful">
                                                <ThumbsDown size={14} />
                                            </button>
                                            <button className="p-1.5 hover:bg-[var(--color-surface-container)] rounded-md transition-colors hover:text-[var(--color-primary)]" title="Share thread">
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
                                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-on-primary)] shadow-sm">
                                    <Sparkles size={16} className="animate-spin" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="text-sm font-medium text-[var(--color-on-background)]">
                                    Perplexity
                                </div>
                                <div className="space-y-2 max-w-xl">
                                    <div className="h-3.5 bg-[var(--color-surface-container)] rounded w-full" />
                                    <div className="h-3.5 bg-[var(--color-surface-container)] rounded w-5/6" />
                                    <div className="h-3.5 bg-[var(--color-surface-container)] rounded w-2/3" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Related Follow-Ups Recommendations Section */}
                    {!sending && messages.length > 0 && messages[messages.length - 1].role === "ai" && (
                        <div className="pt-6 border-t border-[var(--color-border-subtle)] space-y-3 select-none animate-in fade-in duration-300">
                            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-on-background)] mb-2">
                                <Search size={16} className="text-[var(--color-text-muted)]" />
                                <span>Related</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {relatedQuestions.map((q, qIdx) => (
                                    <button
                                        key={qIdx}
                                        onClick={() => onSend(q)}
                                        className="w-full text-left p-3.5 rounded-lg border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)] text-sm text-[var(--color-on-background)] transition-all cursor-pointer shadow-sm hover:shadow-md"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div ref={bottomRef} className="h-10" />
                </div>
            </div>

            {/* Reusable ChatInput Sticky Follow-Up at bottom */}
            <div className="p-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-background)] shrink-0">
                <div className="max-w-3xl w-full mx-auto">
                    <ChatInput onSend={onSend} sending={sending} placeholder="Ask a follow-up..." />
                </div>
            </div>
        </div>
    );
};

export default ConversationView;
