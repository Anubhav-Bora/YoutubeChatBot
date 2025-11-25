'use client';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className={`${sizeClasses[size]} ${className}`} aria-label="YouTube Video Q&A Logo">
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                {/* Outer circle with gradient */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="fill-primary-500 dark:fill-primary-600"
                    opacity="0.1"
                />

                {/* Play button (YouTube reference) */}
                <path
                    d="M35 30 L35 70 L70 50 Z"
                    className="fill-primary-600 dark:fill-primary-400"
                />

                {/* Chat bubble */}
                <path
                    d="M65 20 C72 20 78 26 78 33 L78 43 C78 50 72 56 65 56 L60 56 L55 63 L55 56 L50 56 C43 56 37 50 37 43 L37 33 C37 26 43 20 50 20 Z"
                    className="fill-accent-500 dark:fill-accent-400"
                    opacity="0.9"
                />

                {/* Question mark in chat bubble */}
                <text
                    x="57"
                    y="45"
                    className="fill-white dark:fill-slate-900"
                    fontSize="20"
                    fontWeight="bold"
                    fontFamily="system-ui"
                >
                    ?
                </text>
            </svg>
        </div>
    );
}
