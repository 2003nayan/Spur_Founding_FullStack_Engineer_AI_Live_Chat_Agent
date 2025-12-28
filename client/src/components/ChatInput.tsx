import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const MAX_LENGTH = 500;

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isOverLimit = message.length > MAX_LENGTH;
  const isEmpty = message.trim().length === 0;
  const isValid = !isEmpty && !isOverLimit && !disabled;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (!isValid) return;
    onSend(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div
          className={cn(
            'relative flex items-end gap-3 rounded-xl border bg-background p-2 transition-all duration-200',
            disabled
              ? 'border-border bg-muted/30'
              : 'border-border focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10'
          )}
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />

          <button
            onClick={handleSend}
            disabled={!isValid}
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200',
              isValid
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-2 flex items-center justify-between px-1">
          <span className="text-2xs text-muted-foreground">
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-2xs font-mono">Enter</kbd>
            <span className="ml-1.5">to send</span>
            <span className="mx-1.5 text-border">•</span>
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-2xs font-mono">Shift + Enter</kbd>
            <span className="ml-1.5">for new line</span>
          </span>

          <span
            className={cn(
              'text-2xs font-mono transition-colors',
              isOverLimit ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {message.length}/{MAX_LENGTH}
          </span>
        </div>
      </div>
    </div>
  );
}
