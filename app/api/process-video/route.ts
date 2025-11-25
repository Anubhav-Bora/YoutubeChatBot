import { NextRequest, NextResponse } from 'next/server';
import { TranscriptService } from '@/lib/transcript-service';
import { getRAGService } from '@/lib/rag-service-singleton';
import { getSessionManager } from '@/lib/session-manager';
import { ProcessVideoRequest, ProcessVideoResponse } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const body: ProcessVideoRequest = await request.json();
        const { url } = body;

        // Validate input
        if (!url || typeof url !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Invalid URL provided' },
                { status: 400 }
            );
        }

        // Initialize services
        const transcriptService = new TranscriptService();
        const rag = getRAGService();
        const sessionManager = getSessionManager();

        // Parse YouTube URL
        const videoId = transcriptService.parseYouTubeUrl(url);
        if (!videoId) {
            return NextResponse.json(
                { success: false, error: 'Invalid YouTube URL format' },
                { status: 400 }
            );
        }

        // Extract transcript
        let transcript: string;
        try {
            console.log('[process-video] Extracting transcript for video:', videoId);
            transcript = await transcriptService.extractTranscript(videoId);
            console.log('[process-video] Transcript extracted successfully, length:', transcript.length);
        } catch (error) {
            console.error('[process-video] Transcript extraction failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to extract transcript';
            return NextResponse.json(
                { success: false, error: errorMessage },
                { status: 400 }
            );
        }

        // Get video info
        console.log('[process-video] Fetching video info');
        const videoInfo = await transcriptService.getVideoInfo(videoId);
        console.log('[process-video] Video info:', videoInfo.title);

        // Create session
        const sessionId = sessionManager.createSession(videoId);
        console.log('[process-video] Session created:', sessionId);

        // Process transcript and create embeddings
        try {
            console.log('[process-video] Processing transcript and creating embeddings');
            await rag.processTranscript(transcript, sessionId, videoId);
            console.log('[process-video] Transcript processed successfully');

            // Verify the vector store was created
            const vectorStore = rag.getVectorStore(sessionId);
            if (!vectorStore) {
                throw new Error('Vector store was not created');
            }
            console.log('[process-video] Vector store verified');
        } catch (error) {
            console.error('[process-video] Failed to process transcript:', error);
            sessionManager.deleteSession(sessionId);
            const errorMessage = error instanceof Error ? error.message : 'Failed to process transcript';
            return NextResponse.json(
                { success: false, error: errorMessage },
                { status: 500 }
            );
        }

        // Return success response
        const response: ProcessVideoResponse = {
            success: true,
            videoInfo,
            sessionId,
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error in process-video:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
