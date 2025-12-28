import { Sparkles, Plus } from 'lucide-react';

interface ChatHeaderProps {
  hasMessages: boolean;
  onNewChat: () => void;
}

export function ChatHeader({ hasMessages, onNewChat }: ChatHeaderProps) {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground tracking-tight">
                Spur Store
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                <span className="text-2xs text-muted-foreground">Support Online</span>
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          {hasMessages && (
            <button
              onClick={onNewChat}
              className="btn-secondary gap-1.5 px-3 py-2 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              New conversation
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
