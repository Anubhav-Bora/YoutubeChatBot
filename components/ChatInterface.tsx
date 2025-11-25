'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (question: string) => Promise<void>;
    isProcessing: boolean;
}

export default function ChatInterface({
    messages,
    onSendMessage,
    isProcessing,
}: ChatInterfaceProps) {
    const [question, setQuestion] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [question]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!question.trim() || isProcessing) {
            return;
        }

        const currentQuestion = question;
        setQuestion('');

        try {
            await onSendMessage(currentQuestion);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div
            className="w-full max-w-3xl mx-auto flex flex-col h-[600px] glass rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
            role="region"
            aria-label="Chat interface"
        >
            {/* Messages Container */}
            <div
                className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
                role="log"
                aria-live="polite"
                aria-atomic="false"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center animate-fade-in">
                        <div className="text-center text-slate-500 dark:text-slate-400">
                            <svg
                                className="w-16 h-16 mx-auto mb-4 opacity-50 animate-pulse-slow"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            <p className="text-lg font-medium mb-2">Start a conversation</p>
                            <p className="text-sm">Ask any question about the video content</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-3 shadow-md transition-all duration-200 hover:shadow-lg ${message.role === 'user'
                                        ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                                        }`}
                                    role="article"
                                    aria-label={`${message.role === 'user' ? 'Your' : 'AI'} message`}
                                >
                                    <div className="flex items-start gap-2">
                                        {message.role === 'assistant' && (
                                            <svg
                                                className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-600 dark:text-primary-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                                />
                                            </svg>
                                        )}
                                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                    </div>
                                    <p
                                        className={`text-xs mt-2 ${message.role === 'user'
                                            ? 'text-primary-100'
                                            : 'text-slate-500 dark:text-slate-400'
                                            }`}
                                    >
                                        <time dateTime={message.timestamp.toISOString()}>
                                            {new Date(message.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </time>
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isProcessing && (
                            <div className="flex justify-start animate-fade-in" role="status" aria-live="polite">
                                <div className="max-w-[80%] rounded-lg px-4 py-3 bg-slate-100 dark:bg-slate-700 shadow-md">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1" aria-hidden="true">
                                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">AI is thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Form */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/50">
                <form onSubmit={handleSubmit} className="flex gap-2" role="form" aria-label="Send message">
                    <label htmlFor="question-input" className="sr-only">
                        Ask a question about the video
                    </label>
                    <textarea
                        id="question-input"
                        ref={textareaRef}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question about the video..."
                        disabled={isProcessing}
                        rows={1}
                        aria-label="Question input"
                        className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 
                     bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100
                     placeholder-slate-400 dark:placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     resize-none max-h-32
                     transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500"
                    />
                    <button
                        type="submit"
                        disabled={isProcessing || !question.trim()}
                        aria-label={isProcessing ? 'Sending question' : 'Send question'}
                        className="btn-primary px-6 py-3 flex-shrink-0"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </button>
                </form>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2" role="note">
                    Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">Shift+Enter</kbd> for new line
                </p>
            </div>
        </div>
    );
}
