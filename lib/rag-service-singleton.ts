import { RAGService } from './rag-service';

// Singleton instance using globalThis to persist across hot reloads in development
declare global {
    var ragServiceInstance: RAGService | undefined;
}

export function getRAGService(): RAGService {
    if (!globalThis.ragServiceInstance) {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error('GOOGLE_API_KEY is not configured');
        }
        globalThis.ragServiceInstance = new RAGService(apiKey);
    }
    return globalThis.ragServiceInstance;
}
