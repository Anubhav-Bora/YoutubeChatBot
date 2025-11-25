import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Document } from 'langchain/document';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

export class RAGService {
    private embeddings: GoogleGenerativeAIEmbeddings;
    private textSplitter: RecursiveCharacterTextSplitter;
    private vectorStores: Map<string, MemoryVectorStore>;
    private llm: ChatGoogleGenerativeAI;

    constructor(apiKey: string) {
        this.embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey,
            modelName: 'text-embedding-004',
        });

        this.llm = new ChatGoogleGenerativeAI({
            apiKey,
            modelName: 'gemini-2.0-flash',
            temperature: 0.7,
            maxOutputTokens: 1024,
        });

        this.textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
            separators: ['\n\n', '\n', '. ', ' ', ''],
        });

        this.vectorStores = new Map();
    }

    /**
     * Processes a transcript by chunking, embedding, and storing in vector store
     */
    async processTranscript(
        transcript: string,
        sessionId: string,
        videoId: string
    ): Promise<void> {
        try {
            // Split transcript into chunks
            const chunks = await this.textSplitter.splitText(transcript);

            if (chunks.length === 0) {
                throw new Error('Failed to split transcript into chunks');
            }

            // Create documents with metadata
            const documents = chunks.map(
                (chunk, index) =>
                    new Document({
                        pageContent: chunk,
                        metadata: {
                            videoId,
                            chunkIndex: index,
                            totalChunks: chunks.length,
                        },
                    })
            );

            // Create embeddings and store in vector store
            const vectorStore = await MemoryVectorStore.fromDocuments(
                documents,
                this.embeddings
            );

            // Store the vector store for this session
            this.vectorStores.set(sessionId, vectorStore);
        } catch (error) {
            console.error('Error processing transcript:', error);
            throw new Error('Failed to process transcript');
        }
    }

    /**
     * Retrieves the vector store for a given session
     */
    getVectorStore(sessionId: string): MemoryVectorStore | null {
        return this.vectorStores.get(sessionId) || null;
    }

    /**
     * Retrieves relevant documents for a question using similarity search
     */
    async retrieveRelevantChunks(
        sessionId: string,
        question: string,
        k: number = 4
    ): Promise<Document[]> {
        const vectorStore = this.getVectorStore(sessionId);

        if (!vectorStore) {
            throw new Error('No vector store found for this session');
        }

        // Use similarity search to retrieve relevant chunks
        const retriever = vectorStore.asRetriever({
            k, // Number of documents to retrieve
            searchType: 'similarity',
        });

        const relevantDocs = await retriever.invoke(question);

        return relevantDocs;
    }

    /**
     * Clears the vector store for a given session
     */
    clearSession(sessionId: string): void {
        this.vectorStores.delete(sessionId);
    }

    /**
     * Gets the number of active sessions
     */
    getActiveSessionCount(): number {
        return this.vectorStores.size;
    }

    /**
     * Answers a question using the RAG pipeline with Gemini AI
     */
    async answerQuestion(sessionId: string, question: string): Promise<string> {
        try {
            // Retrieve relevant chunks from vector store
            const relevantDocs = await this.retrieveRelevantChunks(sessionId, question);

            if (relevantDocs.length === 0) {
                return "I couldn't find any relevant information in the video transcript to answer your question. Please try rephrasing your question or ask about a different topic covered in the video.";
            }

            // Combine retrieved chunks into context
            const context = relevantDocs
                .map((doc) => doc.pageContent)
                .join('\n\n');

            // Create prompt template
            const promptTemplate = PromptTemplate.fromTemplate(
                `You are a helpful assistant that answers questions based on the provided video transcript context.

Context from video transcript:
{context}

Question: {question}

Instructions:
- Answer the question based ONLY on the information provided in the context above
- If the context doesn't contain enough information to answer the question, clearly state that the information is not available in the video
- Be concise and accurate in your response
- Use natural language and maintain a helpful tone

Answer:`
            );

            // Create the retrieval chain
            const chain = RunnableSequence.from([
                {
                    context: () => context,
                    question: (input: { question: string }) => input.question,
                },
                promptTemplate,
                this.llm,
                new StringOutputParser(),
            ]);

            // Generate answer
            const answer = await chain.invoke({ question });

            // Format and return the response
            return answer.trim();
        } catch (error) {
            console.error('Error answering question:', error);

            // Handle specific error types
            if (error instanceof Error) {
                if (error.message.includes('No vector store found')) {
                    throw new Error('Session not found. Please process a video first.');
                }
                if (error.message.includes('API key')) {
                    throw new Error('AI service configuration error. Please check your API key.');
                }
                if (error.message.includes('quota') || error.message.includes('rate limit')) {
                    throw new Error('AI service is temporarily unavailable due to rate limiting. Please try again in a moment.');
                }
            }

            throw new Error('Failed to generate answer. Please try again.');
        }
    }
}
