'use client';

import { useState } from 'react';
import VideoInputForm from '@/components/VideoInputForm';
import VideoInfoCard from '@/components/VideoInfoCard';
import ChatInterface from '@/components/ChatInterface';
import Logo from '@/components/Logo';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Message, VideoInfo, ProcessVideoResponse, AskQuestionResponse } from '@/types';

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isProcessingVideo, setIsProcessingVideo] = useState(false);
    const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVideoSubmit = async (url: string) => {
        setIsProcessingVideo(true);
        setError(null);

        try {
            const response = await fetch('/api/process-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const data: ProcessVideoResponse = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to process video');
            }

            // Clear previous conversation and set new video info
            setMessages([]);
            setVideoInfo(data.videoInfo);
            setSessionId(data.sessionId);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to process video';
            setError(errorMessage);
            throw err;
        } finally {
            setIsProcessingVideo(false);
        }
    };

    const handleSendMessage = async (question: string) => {
        if (!sessionId) {
            setError('Please process a video first');
            return;
        }

        setIsProcessingQuestion(true);
        setError(null);

        // Add user message immediately
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: question,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await fetch('/api/ask-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question, sessionId }),
            });

            const data: AskQuestionResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get answer');
            }

            // Add assistant message
            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: data.answer,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to get answer';
            setError(errorMessage);

            // Add error message to chat
            const errorMsg: Message = {
                id: `error-${Date.now()}`,
                role: 'assistant',
                content: `Sorry, I encountered an error: ${errorMessage}`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsProcessingQuestion(false);
        }
    };

    return (
        <main className="min-h-screen animated-gradient">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <header className="text-center mb-8 animate-slide-down" role="banner">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <Logo size="lg" />
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100">
                            <span className="gradient-text">
                                YouTube Video Q&A
                            </span>
                        </h1>
                    </div>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Ask questions about any YouTube video using AI-powered retrieval augmented generation
                    </p>
                </header>

                {/* Video Input Form */}
                <div className="mb-8 animate-fade-in">
                    <VideoInputForm
                        onSubmit={handleVideoSubmit}
                        isLoading={isProcessingVideo}
                    />
                </div>

                {/* Error Display */}
                {error && (
                    <div className="max-w-3xl mx-auto mb-6 animate-slide-down" role="alert" aria-live="assertive">
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-lg">
                            <div className="flex items-start gap-3">
                                <svg
                                    className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Error</p>
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
                                </div>
                                <button
                                    onClick={() => setError(null)}
                                    className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                                    aria-label="Dismiss error"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading Skeleton */}
                {isProcessingVideo && !videoInfo && (
                    <>
                        <LoadingSkeleton type="video" />
                        <LoadingSkeleton type="chat" />
                    </>
                )}

                {/* Video Info Card */}
                {videoInfo && (
                    <div className="animate-slide-up">
                        <VideoInfoCard videoInfo={videoInfo} />
                    </div>
                )}

                {/* Chat Interface */}
                {videoInfo && (
                    <div className="animate-fade-in">
                        <ChatInterface
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isProcessing={isProcessingQuestion}
                        />
                    </div>
                )}

                {/* Instructions */}
                {!videoInfo && !isProcessingVideo && (
                    <div className="max-w-3xl mx-auto mt-12 animate-fade-in">
                        <div className="glass rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700 card-hover">
                            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
                                How it works
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg group-hover:shadow-glow transition-all duration-300">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                                            Paste a YouTube URL
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Enter any YouTube video link in the input field above
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg group-hover:shadow-glow transition-all duration-300">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                                            AI processes the video
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            The system extracts the transcript and creates a searchable knowledge base
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg group-hover:shadow-glow transition-all duration-300">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                                            Ask questions
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Chat with AI to get answers based on the video content
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
