import { Shield } from 'lucide-react';

export function ChatFooter() {
  return (
    <footer className="py-3 px-4">
      <div className="mx-auto max-w-3xl flex items-center justify-center gap-1.5 text-2xs text-muted-foreground">
        <Shield className="h-3 w-3" />
        <span>Secure support</span>
        <span className="mx-1">•</span>
        <span>Available Mon–Fri, 9AM–5PM EST</span>
      </div>
    </footer>
  );
}
