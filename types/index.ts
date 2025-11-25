// Core data models for the application

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface VideoInfo {
    videoId: string;
    title: string;
    thumbnail: string;
    duration?: number;
}

export interface TranscriptChunk {
    text: string;
    metadata: {
        videoId: string;
        startTime?: number;
        chunkIndex: number;
    };
}

export interface ProcessVideoRequest {
    url: string;
}

export interface ProcessVideoResponse {
    success: boolean;
    videoInfo: VideoInfo;
    sessionId: string;
    error?: string;
}

export interface AskQuestionRequest {
    question: string;
    sessionId: string;
}

export interface AskQuestionResponse {
    answer: string;
    sources?: string[];
    error?: string;
}
