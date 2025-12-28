import { Zap } from 'lucide-react';

export function ChatFooter() {
  return (
    <footer className="py-3 px-4">
      <div className="mx-auto max-w-3xl flex items-center justify-center gap-1.5 text-2xs text-muted-foreground">
        <Zap className="h-3 w-3 text-primary" />
        <span>Powered by</span>
        <span className="font-medium text-foreground">Spur</span>
        <span className="mx-1">•</span>
        <span>Mon–Fri, 9AM–5PM EST</span>
      </div>
    </footer>
  );
}
