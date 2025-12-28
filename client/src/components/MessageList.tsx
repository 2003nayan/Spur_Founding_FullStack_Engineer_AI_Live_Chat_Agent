import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Message } from '../api/chat';
import { QuickAction } from '../types/chat';
import { ChatMessage } from './chat/ChatMessage';
import { TypingIndicator } from './chat/TypingIndicator';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  quickActions: QuickAction[];
  onQuickAction: (message: string) => void;
}

export function MessageList({ messages, isLoading, quickActions, onQuickAction }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const lastMessage = messages[messages.length - 1];
  const showQuickActions = lastMessage?.sender === 'ai' && !isLoading;

  return (
    <div className="scrollbar-thin flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLatest={index === messages.length - 1}
          />
        ))}

        {isLoading && <TypingIndicator />}

        {showQuickActions && (
          <div className="animate-in-up ml-11 pt-2">
            <p className="text-2xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Related topics
            </p>
            <div className="flex flex-wrap gap-2">
              {quickActions.slice(0, 3).map((action) => (
                <button
                  key={action.id}
                  onClick={() => onQuickAction(action.message)}
                  disabled={isLoading}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-brand-subtle disabled:opacity-50"
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
