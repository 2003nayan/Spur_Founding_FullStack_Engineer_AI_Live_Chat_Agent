// Use environment variable for production, fallback to proxy for local dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '/chat';

export interface Message {
  id: number;
  conversation_id: string;
  sender: 'user' | 'ai';
  content: string;
  created_at: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
}

export interface HistoryResponse {
  messages: Message[];
  sessionId: string;
}

export interface ApiError {
  error: string;
}

// Send a message to the AI
export async function sendMessage(
  message: string,
  sessionId?: string | null
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      sessionId: sessionId || undefined,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as ApiError).error || 'Failed to send message');
  }

  return data as ChatResponse;
}

// Fetch conversation history
export async function fetchHistory(sessionId: string): Promise<HistoryResponse> {
  const response = await fetch(`${API_BASE_URL}/history/${sessionId}`);
  
  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as ApiError).error || 'Failed to fetch history');
  }

  return data as HistoryResponse;
}
