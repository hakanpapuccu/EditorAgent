import React, { useState, useRef, useEffect } from "react";

interface Props {
    messages: { role: string; content: string }[];
    onSendMessage: (msg: string) => void;
    isLoading: boolean;
}

export const ChatInterface: React.FC<Props> = ({ messages, onSendMessage, isLoading }) => {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onSendMessage(input);
        setInput("");
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${m.role === 'user'
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none shadow-md'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none shadow-sm'
                            }`}>
                            <p className="whitespace-pre-wrap">{m.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-none animate-pulse text-gray-500">
                            Agent is processing...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="absolute bottom-0 w-full p-4 bg-white border-t border-gray-100 backdrop-blur-lg bg-opacity-90">
                <div className="flex gap-3 max-w-3xl mx-auto">
                    <input
                        type="text"
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                        placeholder="Ask the agent to edit the file..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};
