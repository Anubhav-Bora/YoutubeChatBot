import { randomBytes } from 'crypto';

interface SessionData {
    id: string;
    videoId: string;
    createdAt: Date;
    lastAccessedAt: Date;
}

export class SessionManager {
    private sessions: Map<string, SessionData>;
    private readonly SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

    constructor() {
        this.sessions = new Map();

        // Start cleanup interval to remove expired sessions
        this.startCleanupInterval();
    }

    /**
     * Creates a new session and returns the session ID
     */
    createSession(videoId: string): string {
        const sessionId = this.generateSessionId();

        const sessionData: SessionData = {
            id: sessionId,
            videoId,
            createdAt: new Date(),
            lastAccessedAt: new Date(),
        };

        this.sessions.set(sessionId, sessionData);

        return sessionId;
    }

    /**
     * Retrieves session data by session ID
     */
    getSession(sessionId: string): SessionData | null {
        const session = this.sessions.get(sessionId);

        if (!session) {
            return null;
        }

        // Update last accessed time
        session.lastAccessedAt = new Date();

        return session;
    }

    /**
     * Checks if a session exists and is valid
     */
    isValidSession(sessionId: string): boolean {
        const session = this.sessions.get(sessionId);

        if (!session) {
            return false;
        }

        // Check if session has expired
        const now = new Date().getTime();
        const lastAccessed = session.lastAccessedAt.getTime();

        if (now - lastAccessed > this.SESSION_TIMEOUT) {
            this.deleteSession(sessionId);
            return false;
        }

        return true;
    }

    /**
     * Deletes a session
     */
    deleteSession(sessionId: string): void {
        this.sessions.delete(sessionId);
    }

    /**
     * Gets the total number of active sessions
     */
    getActiveSessionCount(): number {
        return this.sessions.size;
    }

    /**
     * Generates a cryptographically secure session ID
     */
    private generateSessionId(): string {
        return randomBytes(32).toString('hex');
    }

    /**
     * Starts an interval to clean up expired sessions
     */
    private startCleanupInterval(): void {
        setInterval(() => {
            const now = new Date().getTime();

            for (const [sessionId, session] of this.sessions.entries()) {
                const lastAccessed = session.lastAccessedAt.getTime();

                if (now - lastAccessed > this.SESSION_TIMEOUT) {
                    this.deleteSession(sessionId);
                }
            }
        }, 10 * 60 * 1000); // Run cleanup every 10 minutes
    }

    /**
     * Clears all sessions (useful for testing)
     */
    clearAllSessions(): void {
        this.sessions.clear();
    }
}

// Singleton instance using globalThis to persist across hot reloads in development
declare global {
    var sessionManagerInstance: SessionManager | undefined;
}

export function getSessionManager(): SessionManager {
    if (!globalThis.sessionManagerInstance) {
        globalThis.sessionManagerInstance = new SessionManager();
    }
    return globalThis.sessionManagerInstance;
}
