'use client';

import Image from 'next/image';
import { VideoInfo } from '@/types';

interface VideoInfoCardProps {
    videoInfo: VideoInfo;
}

export default function VideoInfoCard({ videoInfo }: VideoInfoCardProps) {
    return (
        <div className="w-full max-w-3xl mx-auto mb-6">
            <article
                className="glass rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 card-hover"
                aria-label="Video information"
            >
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                        <div className="relative w-full sm:w-48 h-32 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 group">
                            <Image
                                src={videoInfo.thumbnail}
                                alt={`Thumbnail for ${videoInfo.title}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                unoptimized
                                onError={(e) => {
                                    // Fallback to default thumbnail if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://i.ytimg.com/vi/${videoInfo.videoId}/hqdefault.jpg`;
                                }}
                            />
                            {/* Play icon overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                                <svg
                                    className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-2">
                                    {videoInfo.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>YouTube Video</span>
                                </div>
                            </div>

                            {/* Link to YouTube */}
                            <a
                                href={`https://www.youtube.com/watch?v=${videoInfo.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 hover:scale-110 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                                aria-label="Open video in YouTube (opens in new tab)"
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
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        </div>

                        {/* Status indicator */}
                        <div className="mt-3 flex items-center gap-2">
                            <div
                                className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium shadow-sm"
                                role="status"
                                aria-live="polite"
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
                                <span>Ready for questions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
