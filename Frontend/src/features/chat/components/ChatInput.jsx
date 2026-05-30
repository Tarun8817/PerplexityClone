import React, { useState, useRef, useEffect } from "react";
import {
    ArrowUp,
    Paperclip,
    X,
    Loader2,
} from "lucide-react";

const ChatInput = ({ onSend, sending, placeholder = "Ask anything..." }) => {
    const [inputValue, setInputValue] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    // Auto grow textarea height
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
        }
    }, [inputValue]);

    const compressImage = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.7) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    resolve(canvas.toDataURL("image/jpeg", quality));
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsProcessing(true);
        const base64Promises = files.map(file => compressImage(file));
        try {
            const compressedImages = await Promise.all(base64Promises);
            setSelectedImages(prev => [...prev, ...compressedImages]);
        } catch (err) {
            console.error("Failed to read or compress image", err);
        } finally {
            setIsProcessing(false);
        }
        e.target.value = "";
    };

    const handleRemoveImage = (index) => {
        setSelectedImages(prev => prev.filter((_, idx) => idx !== index));
    };

    const triggerFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if ((inputValue.trim() || selectedImages.length > 0) && !sending) {
            onSend(inputValue.trim(), selectedImages);
            setInputValue("");
            setSelectedImages([]);
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };

    return (
        <div className="w-full relative bg-[#1A1C1C] border border-[#2B2E2E] focus-within:border-[#31b8c6] rounded-2xl p-3 shadow-xl transition-all duration-200">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
            />

            {/* Selected Images Preview Bar */}
            {(selectedImages.length > 0 || isProcessing) && (
                <div className="flex flex-wrap gap-2.5 mb-3 pb-2 border-b border-[#252828] select-none items-center">
                    {selectedImages.map((img, idx) => (
                        <div key={idx} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-[#2B2E2E] shadow-inner bg-[#131515]">
                            <img src={img} alt="preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/60 hover:bg-red-500 text-gray-400 hover:text-white transition-all cursor-pointer shadow-md"
                                title="Remove image"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    ))}
                    {isProcessing && (
                        <div className="w-14 h-14 rounded-lg border border-[#2B2E2E] border-dashed flex flex-col items-center justify-center bg-[#131515] text-[#31b8c6] animate-pulse">
                            <Loader2 size={16} className="animate-spin text-[#31b8c6]" />
                            <span className="text-[8px] font-bold text-gray-500 mt-1">Shrinking</span>
                        </div>
                    )}
                </div>
            )}

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
                    {/* Image Attachment Trigger Button */}
                    <button
                        type="button"
                        onClick={triggerFileSelect}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#2B2E2E] hover:border-[#31b8c6]/30 hover:bg-[#252828] text-gray-400 hover:text-[#31b8c6] text-xs font-semibold transition-all cursor-pointer"
                        title="Upload images"
                    >
                        <Paperclip size={14} className="text-[#31b8c6]" />
                        <span>Upload Images</span>
                    </button>
                </div>
 
                <div className="flex items-center gap-3">
                    {/* Send Button */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={(!inputValue.trim() && selectedImages.length === 0) || sending}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-black font-bold transition-all duration-200 ${
                            (inputValue.trim() || selectedImages.length > 0) && !sending
                                ? "bg-[#31b8c6] text-black shadow-lg shadow-[#31b8c6]/20 hover:scale-105 active:scale-95 cursor-pointer"
                                : "bg-[#2B2E2E] text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {sending ? (
                            <Loader2 size={14} className="animate-spin text-black" />
                        ) : (
                            <ArrowUp size={16} strokeWidth={2.5} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
