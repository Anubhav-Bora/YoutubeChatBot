'use client';

import { useState } from 'react';

interface VideoInputFormProps {
    onSubmit: (url: string) => Promise<void>;
    isLoading: boolean;
}

export default function VideoInputForm({ onSubmit, isLoading }: VideoInputFormProps) {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const validateYouTubeUrl = (url: string): boolean => {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        return youtubeRegex.test(url);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!url.trim()) {
            setError('Please enter a YouTube URL');
            return;
        }

        if (!validateYouTubeUrl(url)) {
            setError('Please enter a valid YouTube URL');
            return;
        }

        try {
            await onSubmit(url);
            // Don't clear URL on success - let parent component handle state
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process video');
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4" role="search" aria-label="Video URL input">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <label htmlFor="youtube-url" className="sr-only">
                            YouTube Video URL
                        </label>
                        <input
                            id="youtube-url"
                            type="text"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                setError('');
                            }}
                            placeholder="Paste YouTube video URL here..."
                            disabled={isLoading}
                            aria-invalid={!!error}
                            aria-describedby={error ? 'url-error' : undefined}
                            className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 
                       bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                       placeholder-slate-400 dark:placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !url.trim()}
                        aria-label={isLoading ? 'Processing video' : 'Process video'}
                        className="btn-primary px-6 py-3 whitespace-nowrap"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>Processing...</span>
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Process Video</span>
                            </span>
                        )}
                    </button>
                </div>

                {error && (
                    <div
                        id="url-error"
                        className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-slide-down"
                        role="alert"
                    >
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </p>
                    </div>
                )}

                {isLoading && (
                    <div
                        className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg animate-slide-down"
                        role="status"
                        aria-live="polite"
                    >
                        <div className="flex items-center gap-3">
                            <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24" aria-hidden="true">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                    Processing video...
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                    Extracting transcript and creating embeddings. This may take a moment.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
