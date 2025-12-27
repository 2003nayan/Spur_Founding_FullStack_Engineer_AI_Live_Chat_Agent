import { useState, useEffect, useCallback } from 'react';
import { sendMessage, fetchHistory, Message } from '../api/chat';

const SESSION_KEY = 'spur_session_id';

interface UseChat {
  messages: Message[];
  isLoading: boolean;
  isHistoryLoading: boolean;
  error: string | null;
  sendUserMessage: (content: string) => Promise<void>;
  clearError: () => void;
  clearSession: () => void;
}

export function useChat(): UseChat {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem(SESSION_KEY);
    if (savedSessionId) {
      setSessionId(savedSessionId);
      loadHistory(savedSessionId);
    }
  }, []);

  // Fetch history for existing session
  const loadHistory = async (sid: string) => {
    setIsHistoryLoading(true);
    try {
      const data = await fetchHistory(sid);
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
        console.log(`Loaded ${data.messages.length} messages from history`);
      }
    } catch (err) {
      console.warn('Could not load history, starting fresh conversation');
      // Session might not exist anymore, clear it
      localStorage.removeItem(SESSION_KEY);
      setSessionId(null);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // Send a user message
  const sendUserMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);

    // Optimistically add user message to UI
    const tempUserMessage: Message = {
      id: Date.now(),
      conversation_id: sessionId || 'temp',
      sender: 'user',
      content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const response = await sendMessage(content, sessionId);

      // Update session ID if new
      if (response.sessionId !== sessionId) {
        setSessionId(response.sessionId);
        localStorage.setItem(SESSION_KEY, response.sessionId);
      }

      // Add AI response
      const aiMessage: Message = {
        id: Date.now() + 1,
        conversation_id: response.sessionId,
        sender: 'ai',
        content: response.reply,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
      // Remove the optimistic user message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear session and start fresh
  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSessionId(null);
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    isHistoryLoading,
    error,
    sendUserMessage,
    clearError,
    clearSession,
  };
}

