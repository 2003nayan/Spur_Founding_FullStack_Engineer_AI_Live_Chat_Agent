import { useState, useCallback, KeyboardEvent, ChangeEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

const MAX_LENGTH = 500;

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((text: string): string | null => {
    if (text.trim().length === 0) {
      return 'Please enter a message';
    }
    if (text.length > MAX_LENGTH) {
      return `Message cannot exceed ${MAX_LENGTH} characters`;
    }
    return null;
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmedMessage = message.trim();
    const validationError = validate(trimmedMessage);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    onSend(trimmedMessage);
    setMessage('');
    setError(null);
  }, [message, onSend, validate]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled) {
        handleSubmit();
      }
    }
  }, [disabled, handleSubmit]);

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  }, [error]);

  const charCount = message.length;
  const isOverLimit = charCount > MAX_LENGTH;

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="glass rounded-2xl p-3 shadow-lg">
        {error && (
          <div className="mb-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={disabled}
              rows={1}
              className={`w-full resize-none bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 text-sm leading-relaxed max-h-32 overflow-y-auto ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ 
                minHeight: '24px',
                height: 'auto'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`text-xs ${
              isOverLimit ? 'text-red-400' : 'text-slate-500'
            }`}>
              {charCount}/{MAX_LENGTH}
            </span>
            
            <button
              onClick={handleSubmit}
              disabled={disabled || isOverLimit || message.trim().length === 0}
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                disabled || isOverLimit || message.trim().length === 0
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95'
              }`}
              aria-label="Send message"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-slate-500 text-center mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
