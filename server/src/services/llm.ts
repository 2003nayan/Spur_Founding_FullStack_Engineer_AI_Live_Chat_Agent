import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import pRetry, { AbortError } from 'p-retry';
import { Message } from '../db';

// ============================================
// Configuration
// ============================================

// Validate API key on startup
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY environment variable is required!');
  console.error('   Get your key at: https://aistudio.google.com/app/apikey');
  console.error('   Then add it to server/.env file');
  process.exit(1);
}

// Retry configuration for resilience
const RETRY_OPTIONS = {
  retries: 3,
  minTimeout: 1000,  // Start with 1 second
  maxTimeout: 5000,  // Max 5 seconds between retries
  factor: 2,         // Exponential backoff factor
  onFailedAttempt: (error: any) => {
    console.warn(
      `LLM API attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`,
      error.message
    );
  },
};

// System prompt for Spur Store support agent
const SYSTEM_PROMPT = `You are Ria, a helpful and friendly support agent for 'Spur Store', an e-commerce platform.

IMPORTANT LANGUAGE RULE:
- Detect the language the user is speaking (English, Hindi, Hinglish, or any other language)
- ALWAYS respond in the SAME language the user uses
- If they write in Hindi, respond in Hindi
- If they write in Hinglish (mix of Hindi and English), respond in Hinglish
- If they write in English, respond in English
- Be natural and conversational in whatever language they use

YOUR IDENTITY:
- Your name is Ria (not [Your Name] or any placeholder)
- You work for Spur Store customer support
- You are helpful, professional, and friendly

STORE POLICIES (Know these well and can explain in any language):
- Returns: 30-day return policy on all items in original condition
- Shipping: Free shipping on orders over $50 (₹4,000)
- Standard shipping: 3-5 business days ($4.99 / ₹400)
- Express shipping: 1-2 business days ($12.99 / ₹1,000)
- Support hours: 9 AM - 5 PM EST (7:30 PM - 3:30 AM IST), Monday through Friday

COMMON TOPICS YOU CAN HELP WITH:
1. Return policy and how to initiate returns
2. Shipping options, costs, and delivery times
3. Support hours and how to reach us
4. General information about Spur Store services
5. Order status inquiries (ask for order number)
6. Product information (connect to specialist if needed)

If you don't know something specific about an order or product, offer to connect them with a specialist.
Be concise but helpful. Use emojis occasionally to be friendly 😊`;

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================================
// Types
// ============================================

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// ============================================
// Helper Functions
// ============================================

// Convert database messages to Gemini format
function convertToGeminiHistory(messages: Message[]): ChatMessage[] {
  return messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
}

// Check if error is retryable
function isRetryableError(error: any): boolean {
  // Retry on rate limits, timeouts, and server errors
  if (error?.status === 429) return true; // Rate limited
  if (error?.status === 503) return true; // Service unavailable
  if (error?.status === 500) return true; // Server error
  if (error?.code === 'ETIMEDOUT') return true;
  if (error?.code === 'ECONNRESET') return true;
  if (error?.code === 'ECONNREFUSED') return true;
  if (error?.message?.includes('quota')) return true;
  if (error?.message?.includes('rate')) return true;
  return false;
}

// ============================================
// Core LLM Function with Retry Logic
// ============================================

async function callGeminiAPI(userMessage: string, history: ChatMessage[]): Promise<string> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.7,
    }
  });

  // Start chat with history
  const chat = model.startChat({ history });

  // Send message and get response
  const result = await chat.sendMessage(userMessage);
  const response = result.response;
  const reply = response.text();
  
  if (!reply) {
    throw new Error('No response generated from AI');
  }

  return reply.trim();
}

// ============================================
// Exported Functions
// ============================================

/**
 * Generate AI response with automatic retry logic.
 * Uses exponential backoff for transient failures.
 */
export async function generateResponse(
  userMessage: string,
  conversationHistory: Message[]
): Promise<string> {
  const history = convertToGeminiHistory(conversationHistory);
  
  try {
    // Use p-retry for automatic retries with exponential backoff
    const response = await pRetry(
      async () => {
        try {
          return await callGeminiAPI(userMessage, history);
        } catch (error: any) {
          // Don't retry non-retryable errors (abort immediately)
          if (!isRetryableError(error)) {
            throw new AbortError(error.message || 'Non-retryable error');
          }
          throw error; // Rethrow for retry
        }
      },
      RETRY_OPTIONS
    );
    
    return response;
    
  } catch (error: any) {
    console.error('Gemini API Error (after retries):', error);
    
    // Handle specific Gemini errors with user-friendly messages
    if (error?.message?.includes('API key') || error?.message?.includes('API_KEY')) {
      throw new Error('AI service configuration error. Please check your API key.');
    }
    if (error?.status === 404 || error?.message?.includes('not found')) {
      console.error('Model not found. Your API key may need the Generative Language API enabled.');
      throw new Error('AI model not available. Please check your API configuration.');
    }
    if (error?.message?.includes('quota') || error?.message?.includes('rate')) {
      throw new Error('Our AI agent is currently busy. Please try again in a few seconds.');
    }
    if (error?.code === 'ETIMEDOUT' || error?.code === 'ECONNRESET') {
      throw new Error('AI service timed out. Please try again.');
    }
    
    throw new Error('Unable to generate response. Please try again later.');
  }
}

/**
 * Get LLM provider name for health checks
 */
export function getLLMProvider(): string {
  return 'Google Gemini';
}
