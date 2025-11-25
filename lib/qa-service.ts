import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

export class QAService {
    private model: ChatGoogleGenerativeAI;

    constructor(apiKey: string) {
        this.model = new ChatGoogleGenerativeAI({
            apiKey,
            modelName: 'gemini-2.0-flash',
            temperature: 0.7,
            maxOutputTokens: 1024,
        });
    }

    /**
     * Answers a question based on the retrieved context from the vector store
     */
    async answerQuestion(
        question: string,
        vectorStore: MemoryVectorStore
    ): Promise<string> {
        try {
            // Retrieve relevant documents
            const retriever = vectorStore.asRetriever({
                k: 4, // Retrieve top 4 most relevant chunks
            });

            const relevantDocs = await retriever.getRelevantDocuments(question);

            if (relevantDocs.length === 0) {
                return "I couldn't find any relevant information in the video transcript to answer your question. Please try rephrasing your question or ask about a different topic covered in the video.";
            }

            // Combine retrieved context
            const context = relevantDocs
                .map((doc) => doc.pageContent)
                .join('\n\n');

            // Create prompt template
            const promptTemplate = PromptTemplate.fromTemplate(`
You are a helpful AI assistant that answers questions based on YouTube video transcripts.

Context from the video transcript:
{context}

Question: {question}

Instructions:
- Answer the question based ONLY on the information provided in the context above
- If the context doesn't contain enough information to answer the question, say so clearly
- Be concise but thorough in your response
- Use natural language and maintain a conversational tone
- If you reference specific information, you can mention it's from the video

Answer:`);

            // Create the chain
            const chain = RunnableSequence.from([
                promptTemplate,
                this.model,
                new StringOutputParser(),
            ]);

            // Generate answer
            const answer = await chain.invoke({
                context,
                question,
            });

            return answer.trim();
        } catch (error) {
            console.error('Error answering question:', error);

            if (error instanceof Error) {
                if (error.message.includes('API key')) {
                    throw new Error('Invalid API key. Please check your Gemini API configuration.');
                }
                if (error.message.includes('quota') || error.message.includes('rate limit')) {
                    throw new Error('API rate limit reached. Please try again in a moment.');
                }
            }

            throw new Error('Failed to generate answer. Please try again.');
        }
    }

    /**
     * Formats the AI response for display
     */
    formatResponse(response: string): string {
        return response
            .trim()
            .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
            .replace(/^\s+|\s+$/g, ''); // Trim whitespace
    }
}
