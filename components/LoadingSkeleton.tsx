'use client';

interface LoadingSkeletonProps {
    type?: 'video' | 'message' | 'chat';
}

export default function LoadingSkeleton({ type = 'video' }: LoadingSkeletonProps) {
    if (type === 'video') {
        return (
            <div className="w-full max-w-3xl mx-auto mb-6 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                        {/* Thumbnail skeleton */}
                        <div className="flex-shrink-0">
                            <div className="w-full sm:w-48 h-32 rounded-lg skeleton" />
                        </div>

                        {/* Info skeleton */}
                        <div className="flex-1 space-y-3">
                            <div className="h-6 skeleton w-3/4" />
                            <div className="h-4 skeleton w-1/2" />
                            <div className="h-6 skeleton w-32 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'message') {
        return (
            <div className="flex justify-start animate-fade-in">
                <div className="max-w-[80%] rounded-lg px-4 py-3 bg-slate-100 dark:bg-slate-700">
                    <div className="space-y-2">
                        <div className="h-4 skeleton w-64" />
                        <div className="h-4 skeleton w-48" />
                        <div className="h-3 skeleton w-16 mt-2" />
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'chat') {
        return (
            <div className="w-full max-w-3xl mx-auto animate-fade-in">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 h-[600px] flex flex-col">
                    <div className="flex-1 p-4 space-y-4">
                        <LoadingSkeleton type="message" />
                        <div className="flex justify-end">
                            <div className="max-w-[80%] rounded-lg px-4 py-3 skeleton h-20 w-64" />
                        </div>
                        <LoadingSkeleton type="message" />
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                        <div className="h-12 skeleton rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
