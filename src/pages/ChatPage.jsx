import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import Navbar from '../components/Navbar';

const ChatPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: 'Hello! I\'m your AI Financial Analyst powered by MCP Multi-Agent System. I can help you with market analysis, investment strategies, and portfolio recommendations. How can I assist you today?',
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: inputMessage,
            timestamp: new Date(),
        };

        setMessages([...messages, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const botMessage = {
                id: messages.length + 2,
                sender: 'bot',
                text: 'Based on current market analysis from our Multi-Agent System:\n\n📊 Technical Analysis: AAPL shows strong bullish momentum with RSI at 62.\n💭 Sentiment Analysis: FinBERT sentiment score: +0.78 (Positive)\n🎯 Investment Strategy: Recommend BUY with target price $185.\n⚠️ Risk Assessment: Moderate volatility detected.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col">
                <div className="bg-white rounded-xl shadow-md flex-1 flex flex-col overflow-hidden">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center gap-3">
                        <div className="bg-white p-2 rounded-full">
                            <Bot className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold">MCP Financial Analyst</h2>
                            <p className="text-blue-100 text-sm">Multi-Agent AI System</p>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-600' : 'bg-purple-600'
                                    }`}>
                                    {message.sender === 'user' ? (
                                        <User className="w-5 h-5 text-white" />
                                    ) : (
                                        <Bot className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                <div className={`flex-1 max-w-2xl ${message.sender === 'user' ? 'flex justify-end' : ''}`}>
                                    <div className={`px-4 py-3 rounded-2xl whitespace-pre-line ${message.sender === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        <p className="text-sm">{message.text}</p>
                                        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                                            }`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                                    <Loader className="w-5 h-5 text-gray-600 animate-spin" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t p-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask about market insights, strategies, or portfolio analysis..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
