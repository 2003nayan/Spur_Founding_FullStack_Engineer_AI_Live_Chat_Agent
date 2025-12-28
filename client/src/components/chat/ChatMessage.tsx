import { User, Sparkles, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../../api/chat';
import { cn } from '../../lib/utils';

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={cn('animate-in-up', isLatest && 'animate-fade')}>
      <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
        {/* Avatar */}
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            isUser
              ? 'bg-foreground text-background'
              : 'bg-brand-subtle text-primary'
          )}
        >
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </div>

        {/* Content */}
        <div className={cn('flex max-w-[85%] flex-col gap-1.5', isUser && 'items-end')}>
          {/* Sender name */}
          <span className="text-2xs font-medium text-muted-foreground px-1">
            {isUser ? 'You' : 'Ria'}
          </span>

          {/* Message bubble */}
          <div
            className={cn(
              'rounded-2xl px-4 py-3',
              isUser
                ? 'bg-foreground text-background rounded-tr-md'
                : 'surface-card rounded-tl-md'
            )}
          >
            {isUser ? (
              <p className="text-sm leading-relaxed">{message.content}</p>
            ) : (
              <div className="prose-sm">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-3 last:mb-0 text-sm leading-relaxed text-foreground">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-3 space-y-1.5 text-sm text-foreground">{children}</ul>
                    ),
                    li: ({ children }) => (
                      <li className="flex items-start gap-2 text-foreground">
                        <Check className="h-4 w-4 mt-0.5 text-success shrink-0" />
                        <span>{children}</span>
                      </li>
                    ),
                    table: ({ children }) => (
                      <div className="my-3 overflow-hidden rounded-lg border border-border">
                        <table className="w-full text-sm">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-muted/50">{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="px-3 py-2 text-left text-2xs font-medium uppercase tracking-wider text-muted-foreground">{children}</th>
                    ),
                    td: ({ children }) => (
                      <td className="px-3 py-2.5 text-foreground border-t border-border">{children}</td>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <span className="text-2xs text-muted-foreground px-1">
            {formatTimestamp(message.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
