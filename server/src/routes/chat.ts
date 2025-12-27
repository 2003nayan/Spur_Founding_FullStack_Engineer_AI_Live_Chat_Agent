import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  createConversation,
  conversationExists,
  saveMessage,
  getConversationHistory,
  getAllMessages
} from '../db';
import { generateResponse } from '../services/llm';

const router = Router();

// ============================================
// Zod Validation Schemas
// ============================================

const ChatMessageSchema = z.object({
  message: z
    .string({
      required_error: 'Message is required',
      invalid_type_error: 'Message must be a string'
    })
    .min(1, 'Message cannot be empty')
    .max(500, 'Message cannot exceed 500 characters')
    .transform(val => val.trim()),
  sessionId: z
    .string()
    .uuid('Invalid session ID format')
    .optional()
});

const SessionIdParamSchema = z.object({
  sessionId: z
    .string()
    .uuid('Invalid session ID format')
});

// Type inference from schemas
type ChatMessageInput = z.infer<typeof ChatMessageSchema>;

// ============================================
// Response Types
// ============================================

interface ChatResponse {
  reply: string;
  sessionId: string;
}

interface ErrorResponse {
  error: string;
  details?: z.ZodIssue[];
}

// ============================================
// Middleware: Zod Validation Helper
// ============================================

function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: () => void) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: result.error.errors[0]?.message || 'Validation failed',
        details: result.error.errors
      } as ErrorResponse);
    }
    req.body = result.data;
    next();
  };
}

// ============================================
// Routes
// ============================================

// POST /chat/message - Send a message and get AI response
router.post(
  '/message', 
  validateBody(ChatMessageSchema),
  async (req: Request, res: Response) => {
    try {
      const { message, sessionId } = req.body as ChatMessageInput;

      // Handle session (create new or use existing)
      let currentSessionId: string;
      
      if (sessionId && conversationExists(sessionId)) {
        currentSessionId = sessionId;
      } else {
        currentSessionId = createConversation();
      }

      // Get conversation history (last 10 messages for context)
      const history = getConversationHistory(currentSessionId, 10);

      // Save user message
      saveMessage(currentSessionId, 'user', message);

      // Generate AI response (with built-in retry logic)
      const aiReply = await generateResponse(message, history);

      // Save AI response
      saveMessage(currentSessionId, 'ai', aiReply);

      // Return response
      return res.json({
        reply: aiReply,
        sessionId: currentSessionId
      } as ChatResponse);

    } catch (error: any) {
      console.error('Chat endpoint error:', error);
      
      // Return user-friendly error message
      return res.status(500).json({
        error: error.message || 'An unexpected error occurred. Please try again.'
      } as ErrorResponse);
    }
  }
);

// GET /chat/history/:sessionId - Get full conversation history
router.get('/history/:sessionId', (req: Request, res: Response) => {
  try {
    // Validate session ID param
    const paramResult = SessionIdParamSchema.safeParse(req.params);
    if (!paramResult.success) {
      return res.status(400).json({ 
        error: 'Invalid session ID format'
      } as ErrorResponse);
    }

    const { sessionId } = paramResult.data;

    if (!conversationExists(sessionId)) {
      return res.status(404).json({ 
        error: 'Conversation not found' 
      } as ErrorResponse);
    }

    const messages = getAllMessages(sessionId);
    
    return res.json({ messages, sessionId });

  } catch (error: any) {
    console.error('History endpoint error:', error);
    return res.status(500).json({
      error: 'Failed to retrieve conversation history'
    } as ErrorResponse);
  }
});

export default router;
