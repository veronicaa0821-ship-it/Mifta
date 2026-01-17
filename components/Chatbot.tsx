
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Product } from '../types';

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
);

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface ChatbotProps {
    products: Product[];
}

const Chatbot: React.FC<ChatbotProps> = ({ products }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const productInfo = JSON.stringify(products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        subcategory: p.subcategory,
        price: p.price,
        description: p.description
    })));

    useEffect(() => {
        if (isOpen && !chatRef.current) {
            const ai = new GoogleGenAI({ apiKey: AIzaSyApq-sbVCM8S3NKusTQ90L2ycLA_0O8JLw });
            chatRef.current = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                    systemInstruction: `You are Zephyra, a friendly and expert AI shopping assistant for a luxury beauty brand. Your goal is to help users discover the perfect skincare and haircare products. You are knowledgeable about all the products listed below. Use this information to answer questions, provide recommendations, and help users find what they're looking for. Keep your responses helpful, elegant, and concise, in line with the Zephyra brand. Here are the available products in JSON format: ${productInfo}`,
                },
            });
            setMessages([{ role: 'model', text: 'Hello! I am Zephyra, your personal beauty assistant. How can I help you today?' }]);
        }
    }, [isOpen, productInfo]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !chatRef.current) return;
        const userInput = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userInput }]);
        setIsLoading(true);

        try {
            const result = await chatRef.current.sendMessageStream({ message: userInput });
            let text = '';
            for await (const chunk of result) {
                const c = chunk as GenerateContentResponse;
                text += c.text;
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage && lastMessage.role === 'model') {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1] = { ...lastMessage, text };
                        return newMessages;
                    } else {
                        return [...prev, { role: 'model', text }];
                    }
                });
            }
        } catch (error) {
            console.error('Gemini API error:', error);
            setMessages(prev => [...prev, { role: 'model', text: 'I seem to be having trouble connecting. Please try again in a moment.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-0 right-0 m-6 transition-all duration-300 ${isOpen ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <button onClick={() => setIsOpen(true)} className="flex items-center justify-center h-16 w-16 bg-maroon-800 text-white rounded-full shadow-lg hover:bg-maroon-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon-700">
                    <ChatIcon />
                </button>
            </div>

            <div className={`fixed bottom-0 right-0 sm:m-6 bg-white rounded-lg shadow-2xl border border-maroon-100 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0 w-full h-full sm:w-96 sm:h-[600px]' : 'opacity-0 translate-y-10 pointer-events-none w-full h-full sm:w-96 sm:h-[600px]'}`}>
                <header className="flex items-center justify-between p-4 bg-maroon-50 border-b border-maroon-200">
                    <h3 className="font-serif text-xl font-bold text-maroon-900">Zephyra Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-maroon-700 hover:text-maroon-900">
                        <CloseIcon />
                    </button>
                </header>
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="flex flex-col space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-maroon-800 text-white' : 'bg-maroon-100 text-maroon-900'}`}>
                                    <p className="text-sm" style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-xs lg:max-w-sm px-4 py-2 rounded-lg bg-maroon-100 text-maroon-900">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-maroon-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-maroon-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                        <div className="w-2 h-2 bg-maroon-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <div className="p-4 bg-maroon-50 border-t border-maroon-200">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                            placeholder="Ask about products..."
                            className="flex-1 block w-full rounded-md border-maroon-200 shadow-sm focus:border-maroon-700 focus:ring-maroon-700"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading} className="p-2 rounded-full bg-maroon-800 text-white hover:bg-maroon-900 disabled:bg-maroon-400 disabled:cursor-not-allowed transition-colors">
                           <SendIcon />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
