import { Innertube } from 'youtubei.js';
import { VideoInfo } from '@/types';

export class TranscriptService {
    /**
     * Parses a YouTube URL and extracts the video ID
     * Supports various YouTube URL formats:
     * - https://www.youtube.com/watch?v=VIDEO_ID
     * - https://youtu.be/VIDEO_ID
     * - https://www.youtube.com/embed/VIDEO_ID
     */
    parseYouTubeUrl(url: string): string | null {
        try {
            const urlObj = new URL(url);

            // Standard youtube.com/watch?v= format
            if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
                return urlObj.searchParams.get('v');
            }

            // Shortened youtu.be format
            if (urlObj.hostname === 'youtu.be') {
                return urlObj.pathname.slice(1);
            }

            // Embed format youtube.com/embed/
            if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.includes('/embed/')) {
                return urlObj.pathname.split('/embed/')[1]?.split('?')[0];
            }

            return null;
        } catch {
            return null;
        }
    }

    /**
     * Extracts the transcript from a YouTube video using youtubei.js
     */
    async extractTranscript(videoId: string): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let info: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let transcriptData: any;

        try {
            // Initialize YouTube client
            const youtube = await Innertube.create();

            // Get video info - may throw parsing errors but still returns data
            try {
                info = await youtube.getInfo(videoId);
            } catch (parseError) {
                // If it's a parsing error, log it but continue if we got the info object
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const err = parseError as any;
                if (err.message?.includes('Type mismatch') || err.message?.includes('ParsingError')) {
                    console.warn('YouTube parsing warning (non-critical):', err.message);
                    // The error is thrown but info might still be populated
                    if (!err.info) {
                        throw new Error('Failed to get video information');
                    }
                    info = err.info;
                } else {
                    throw parseError;
                }
            }

            if (!info) {
                throw new Error('Failed to get video information');
            }

            // Get transcript
            try {
                transcriptData = await info.getTranscript();
            } catch (transcriptError) {
                // Handle transcript-specific errors
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const err = transcriptError as any;
                if (err.message?.includes('Transcript is disabled')) {
                    throw new Error('Transcripts are disabled for this video. Please try a video with captions enabled.');
                }
                throw new Error('No transcript available for this video. Please try a video with captions or subtitles.');
            }

            if (!transcriptData || !transcriptData.transcript) {
                throw new Error('No transcript available for this video. Please try a video with captions or subtitles.');
            }

            // Extract text from transcript segments
            const transcript = transcriptData.transcript;
            const segments = transcript.content?.body?.initial_segments;

            if (!segments || segments.length === 0) {
                throw new Error('No transcript available for this video. Please try a video with captions or subtitles.');
            }

            // Combine all transcript segments into a single string
            const fullTranscript = segments
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((segment: any) => segment.snippet?.text?.toString() || '')
                .filter((text: string) => text.length > 0)
                .join(' ')
                .replace(/\s+/g, ' ') // Normalize whitespace
                .trim();

            if (!fullTranscript || fullTranscript.length === 0) {
                throw new Error('Transcript is empty');
            }

            return fullTranscript;
        } catch (err) {
            if (err instanceof Error) {
                // Re-throw our custom error messages
                if (err.message.includes('No transcript') ||
                    err.message.includes('Transcript is empty') ||
                    err.message.includes('Transcripts are disabled')) {
                    throw err;
                }
            }
            console.error('Transcript extraction error:', err);
            throw new Error('Failed to extract transcript. The video may not have captions enabled.');
        }
    }

    /**
     * Retrieves video metadata including title and thumbnail
     */
    async getVideoInfo(videoId: string): Promise<VideoInfo> {
        try {
            // Use YouTube oEmbed API to get video info
            const response = await fetch(
                `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch video information');
            }

            const data = await response.json();

            return {
                videoId,
                title: data.title || 'Unknown Title',
                thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
            };
        } catch {
            // Fallback to basic info if oEmbed fails
            return {
                videoId,
                title: 'YouTube Video',
                thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
            };
        }
    }
}
