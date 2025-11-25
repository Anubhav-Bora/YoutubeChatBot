import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: "YouTube Video Q&A - AI-Powered RAG Application",
    description: "Ask questions about any YouTube video using AI-powered retrieval augmented generation. Get instant answers based on video transcripts with Gemini AI.",
    keywords: ["YouTube", "Q&A", "AI", "RAG", "Gemini", "Video Analysis", "Transcript"],
    authors: [{ name: "YouTube Video Q&A" }],
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#0ea5e9" },
        { media: "(prefers-color-scheme: dark)", color: "#0284c7" }
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable}>
            <body className={inter.className} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
