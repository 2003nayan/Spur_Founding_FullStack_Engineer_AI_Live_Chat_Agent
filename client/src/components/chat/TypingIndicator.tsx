import { Sparkles } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="animate-in-up flex gap-3">
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-primary">
        <Sparkles className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <span className="text-2xs font-medium text-muted-foreground px-1">Ria</span>
        <div className="surface-card rounded-2xl rounded-tl-md px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
            <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
            <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
