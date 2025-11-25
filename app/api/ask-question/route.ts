import { NextRequest, NextResponse } from 'next/server';
import { getRAGService } from '@/lib/rag-service-singleton';
import { QAService } from '@/lib/qa-service';
import { getSessionManager } from '@/lib/session-manager';
import { AskQuestionRequest, AskQuestionResponse } from '@/types';

// Initialize QA service
let qaService: QAService | null = null;

function getQAService(): QAService {
    if (!qaService) {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error('GOOGLE_API_KEY is not configured');
        }
        qaService = new QAService(apiKey);
    }
    return qaService;
}

export async function POST(request: NextRequest) {
    try {
        const body: AskQuestionRequest = await request.json();
        const { question, sessionId } = body;

        // Validate input
        if (!question || typeof question !== 'string' || question.trim().length === 0) {
            return NextResponse.json(
                { error: 'Invalid question provided' },
                { status: 400 }
            );
        }

        if (!sessionId || typeof sessionId !== 'string') {
            return NextResponse.json(
                { error: 'Invalid session ID provided' },
                { status: 400 }
            );
        }

        // Initialize services
        const sessionManager = getSessionManager();
        const rag = getRAGService();
        const qa = getQAService();

        // Validate session
        console.log('[ask-question] Validating session:', sessionId);
        console.log('[ask-question] Active sessions:', sessionManager.getActiveSessionCount());

        if (!sessionManager.isValidSession(sessionId)) {
            console.error('[ask-question] Invalid session:', sessionId);
            return NextResponse.json(
                { error: 'Invalid or expired session. Please process a video first.' },
                { status: 400 }
            );
        }

        // Get vector store for this session
        console.log('[ask-question] Getting vector store for session');
        const vectorStore = rag.getVectorStore(sessionId);
        if (!vectorStore) {
            console.error('[ask-question] No vector store found for session:', sessionId);
            return NextResponse.json(
                { error: 'No video data found for this session. Please process a video first.' },
                { status: 400 }
            );
        }
        console.log('[ask-question] Vector store found, processing question');

        // Answer the question
        let answer: string;
        try {
            answer = await qa.answerQuestion(question, vectorStore);
            answer = qa.formatResponse(answer);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate answer';
            return NextResponse.json(
                { error: errorMessage },
                { status: 500 }
            );
        }

        // Return success response
        const response: AskQuestionResponse = {
            answer,
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error in ask-question:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
