# Implementation Plan

- [x] 1. Initialize Next.js project with required dependencies


  - Create Next.js 14+ project with App Router and TypeScript
  - Install dependencies: @langchain/google-genai, @langchain/community, langchain, youtube-transcript, fast-check, vitest
  - Configure Tailwind CSS with custom theme
  - Set up environment variables structure (.env.local template)
  - _Requirements: 5.1, 7.1, 8.1_



- [x] 2. Implement transcript extraction service









  - Create TranscriptService class with YouTube URL parsing
  - Implement extractTranscript method using youtube-transcript library
  - Add getVideoInfo method to fetch video metadata (title, thumbnail)
  - Implement error handling for missing transcripts and invalid URLs
  - _Requirements: 1.1, 1.2, 1.5_

- [ ]* 2.1 Write property test for URL parsing
  - **Property 1: Valid URL transcript extraction**
  - **Validates: Requirements 1.1**

- [ ]* 2.2 Write property test for invalid URL handling
  - **Property 2: Invalid URL error handling**


  - **Validates: Requirements 1.2**

- [x] 3. Build RAG service with LangChain integration







  - Create RAGService class with vector store initialization
  - Implement transcript chunking using RecursiveCharacterTextSplitter
  - Set up GoogleGenerativeAIEmbeddings for vector generation
  - Initialize MemoryVectorStore for session-based storage
  - Configure retriever with similarity search
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 7.2, 7.3, 7.4_

- [ ]* 3.1 Write property test for transcript chunking
  - **Property 3: Transcript chunking consistency**
  - **Validates: Requirements 2.1**

- [ ]* 3.2 Write property test for embedding generation
  - **Property 4: Embedding generation completeness**
  - **Validates: Requirements 2.2**



- [ ]* 3.3 Write property test for vector store round-trip
  - **Property 5: Vector store round-trip preservation**
  - **Validates: Requirements 2.3**

- [x] 4. Implement question answering with Gemini AI




  - Integrate ChatGoogleGenerativeAI model in RAGService
  - Create answerQuestion method with retrieval chain
  - Implement prompt template with context and question
  - Add response formatting and error handling
  - Handle cases where information is not in transcript
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 8.2, 8.4, 8.5_

- [ ]* 4.1 Write property test for retrieval behavior
  - **Property 8: Question retrieval behavior**
  - **Validates: Requirements 3.1**

- [ ]* 4.2 Write property test for context inclusion
  - **Property 9: Context inclusion in AI prompts**


  - **Validates: Requirements 3.2, 8.4**

- [ ]* 4.3 Write property test for AI error handling
  - **Property 18: AI service error handling**
  - **Validates: Requirements 8.3**

- [x] 5. Create session management system



  - Implement SessionManager class with Map-based storage
  - Add createSession method with unique ID generation
  - Implement getSession and deleteSession methods
  - Add session cleanup and timeout logic
  - _Requirements: 2.5, 9.1, 9.2_



- [ ]* 5.1 Write property test for session persistence
  - **Property 7: Session persistence**
  - **Validates: Requirements 2.5**

- [ ]* 5.2 Write property test for video isolation
  - **Property 20: Video processing isolation**
  - **Validates: Requirements 9.1, 9.2**

- [x] 6. Build API route for video processing




  - Create POST /api/process-video endpoint
  - Implement request validation and URL parsing
  - Integrate TranscriptService for transcript extraction
  - Call RAGService to process and embed transcript


  - Return video info and session ID in response
  - Add comprehensive error handling
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4_

- [ ]* 6.1 Write unit tests for process-video API route
  - Test successful video processing flow
  - Test invalid URL handling
  - Test missing transcript error handling
  - Test session creation
-

- [x] 7. Build API route for question answering









  - Create POST /api/ask-question endpoint
  - Implement request validation for question and session ID


  - Retrieve session from SessionManager
  - Call RAGService answerQuestion method
  - Return formatted answer with optional sources
  - Handle errors and invalid sessions
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 7.1 Write unit tests for ask-question API route
  - Test successful question answering
  - Test invalid session handling
  - Test empty question handling
  - Test AI service errors

- [x] 8. Create VideoInputForm component





  - Build form with YouTube URL input field
  - Implement URL validation on client side


  - Add submit handler that calls /api/process-video
  - Display loading state during processing
  - Show error messages for invalid URLs or processing failures
  - Disable input during processing
  - _Requirements: 1.1, 1.2, 1.3, 9.5_

- [ ]* 8.1 Write property test for loading state
  - **Property 15: Loading state management**
  - **Validates: Requirements 1.3, 6.1, 6.2, 6.3**



- [ ]* 8.2 Write property test for input availability
  - **Property 21: Input availability**
  - **Validates: Requirements 9.5**

- [x] 9. Create VideoInfoCard component




  - Build card component to display video thumbnail
  - Show video title with proper formatting
  - Add responsive styling with Tailwind CSS
  - Handle missing thumbnail gracefully
  - _Requirements: 5.2, 5.4_

- [ ]* 9.1 Write property test for video info display
  - **Property 14: Video information display**
  - **Validates: Requirements 5.2, 9.4**
-

- [x] 10. Build ChatInterface component



  - Create message list with user/assistant distinction
  - Implement question input field with submit handler


  - Add auto-scroll to latest message
  - Display loading indicator during AI response
  - Style messages with Tailwind CSS for clear visual distinction
  - Implement responsive design for mobile and desktop
  - _Requirements: 3.3, 4.1, 4.2, 4.3, 4.4, 5.3, 5.4, 5.5, 6.3_

- [ ]* 10.1 Write property test for message history
  - **Property 11: Message history persistence**
  - **Validates: Requirements 4.1, 4.2**

- [ ]* 10.2 Write property test for message ordering
  - **Property 12: Chronological message ordering**
  - **Validates: Requirements 4.3**

- [ ]* 10.3 Write property test for response display
  - **Property 10: Response display in chat**
  - **Validates: Requirements 3.3**

- [x] 11. Implement main page with state management


  - Create main page component integrating all UI components
  - Implement state management for messages, video info, and loading states
  - Add handler for video submission that updates session
  - Implement question submission handler calling /api/ask-question
  - Handle conversation reset when new video is loaded
  - Add error boundary for graceful error handling
  - _Requirements: 4.5, 6.1, 6.2, 6.4, 6.5, 9.3_

- [ ]* 11.1 Write property test for conversation reset
  - **Property 13: Conversation reset on new video**
  - **Validates: Requirements 4.5, 9.3**

- [-]* 11.2 Write property test for processing completion

  - **Property 16: Processing completion state**
  - **Validates: Requirements 1.4, 6.5**

- [ ]* 11.3 Write property test for error display
  - **Property 17: Error message display**
/  - **Validates: Requirements 6.4**

- [x] 12. Add professional styling and UI polish





  - Create custom Tailwind theme with professional color palette
  - Add smooth transitions and animations
  - Implement loading skeletons for better UX
  - Add hover states and interactive feedback
  - Ensure consistent spacing and typography
  - Add app logo and branding elements
  - Optimize for accessibility (ARIA labels, keyboard navigation)
  - _Requirements: 5.1, 5.3, 5.4, 5.5_

- [ ]* 12.1 Write unit tests for component styling
  - Test that components render with correct CSS classes
  - Test responsive behavior with different viewport sizes
  - Test accessibility attributes

- [x] 13. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Create environment configuration and documentation


  - Create .env.local.example with required variables
  - Write README.md with setup instructions
  - Document API key acquisition process
  - Add usage examples and screenshots
  - Document deployment steps
  - _Requirements: All_

- [ ]* 14.1 Write integration tests for complete user flows
  - Test end-to-end flow: submit URL → process → ask question → receive answer
  - Test error recovery flows
  - Test session management across multiple videos
  - Test concurrent user sessions


- [x] 15. Final checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.
