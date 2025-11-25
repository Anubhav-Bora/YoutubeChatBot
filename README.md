# YouTube Video Q&A - RAG Application

A Next.js application that enables users to ask questions about YouTube videos using AI-powered Retrieval Augmented Generation (RAG). The system extracts video transcripts, processes them through a vector store, and uses Google's Gemini AI to provide accurate answers based on the video content.

## Features

- 🎥 **YouTube Video Processing**: Extract transcripts from any YouTube video with available captions
- 🤖 **AI-Powered Q&A**: Ask questions and get intelligent answers using Google Gemini AI
- 🔍 **Semantic Search**: Uses vector embeddings for accurate context retrieval
- 💬 **Chat Interface**: Intuitive conversation-style interface with message history
- 🎨 **Modern UI**: Professional, responsive design with Tailwind CSS
- ⚡ **Real-time Processing**: Fast transcript extraction and embedding generation
- 🌙 **Dark Mode**: Automatic dark mode support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Framework**: LangChain.js
- **Language Model**: Google Gemini AI
- **Vector Store**: In-memory vector store (MemoryVectorStore)
- **Embeddings**: Google Generative AI Embeddings
- **Transcript Extraction**: youtube-transcript

## Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd youtube-video-qa-rag
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Google Gemini API key:
   ```
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

## Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Paste it into your `.env.local` file

## Usage

### Development Mode

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build the application for production:

```bash
npm run build
npm start
```

## How It Works

1. **Paste a YouTube URL**: Enter any YouTube video link in the input field
2. **AI Processes the Video**: The system extracts the transcript and creates a searchable knowledge base using vector embeddings
3. **Ask Questions**: Chat with the AI to get answers based on the video content

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── ask-question/      # API route for question answering
│   │   └── process-video/     # API route for video processing
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main page with state management
│   └── globals.css            # Global styles
├── components/
│   ├── ChatInterface.tsx      # Chat UI component
│   ├── VideoInfoCard.tsx      # Video information display
│   └── VideoInputForm.tsx     # URL input form
├── lib/
│   ├── transcript-service.ts  # YouTube transcript extraction
│   ├── rag-service.ts         # RAG pipeline with LangChain
│   ├── qa-service.ts          # Question answering with Gemini
│   └── session-manager.ts     # Session management
├── types/
│   └── index.ts               # TypeScript type definitions
└── .env.local.example         # Environment variables template
```

## API Routes

### POST /api/process-video

Processes a YouTube video and creates embeddings.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "success": true,
  "videoInfo": {
    "videoId": "VIDEO_ID",
    "title": "Video Title",
    "thumbnail": "https://..."
  },
  "sessionId": "unique-session-id"
}
```

### POST /api/ask-question

Answers a question based on the video transcript.

**Request:**
```json
{
  "question": "What is this video about?",
  "sessionId": "unique-session-id"
}
```

**Response:**
```json
{
  "answer": "Based on the video transcript, this video is about..."
}
```

## Configuration

### Chunk Size and Overlap

The transcript is split into chunks for processing. You can adjust these settings in `lib/rag-service.ts`:

```typescript
this.textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,        // Size of each chunk
  chunkOverlap: 200,      // Overlap between chunks
});
```

### Retrieval Settings

Adjust the number of relevant chunks retrieved in `lib/qa-service.ts`:

```typescript
const retriever = vectorStore.asRetriever({
  k: 4,  // Number of chunks to retrieve
});
```

### Session Timeout

Sessions expire after 1 hour of inactivity. Adjust in `lib/session-manager.ts`:

```typescript
private readonly SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your `GOOGLE_API_KEY` environment variable
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

Make sure to set the `GOOGLE_API_KEY` environment variable in your deployment platform.

## Limitations

- Only works with YouTube videos that have available transcripts/captions
- Session data is stored in memory (resets on server restart)
- Rate limits apply based on your Gemini API quota

## Troubleshooting

### "No transcript available for this video"

- The video doesn't have captions enabled
- Try a different video with auto-generated or manual captions

### "Invalid API key"

- Check that your `GOOGLE_API_KEY` is correctly set in `.env.local`
- Ensure the API key is valid and has the necessary permissions

### Build Errors

- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Try `npm run build` to see detailed error messages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- RAG implementation using [LangChain](https://js.langchain.com/)
- Transcript extraction via [youtube-transcript](https://www.npmjs.com/package/youtube-transcript)
