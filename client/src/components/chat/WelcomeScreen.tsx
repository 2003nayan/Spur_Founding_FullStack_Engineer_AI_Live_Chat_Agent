import { Headphones, ArrowRight } from 'lucide-react';
import { QuickAction } from '../../types/chat';

interface WelcomeScreenProps {
  quickActions: QuickAction[];
  onQuickAction: (message: string) => void;
  isLoading: boolean;
}

export function WelcomeScreen({ quickActions, onQuickAction, isLoading }: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-subtle">
              <Headphones className="h-7 w-7 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-background bg-success" />
          </div>
        </div>

        {/* Copy */}
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-semibold tracking-tight text-foreground">
            How can we help you today?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            I'm Ria, your support assistant. Ask me anything about orders, shipping, returns, or our products.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-2xs font-medium uppercase tracking-wider text-muted-foreground mb-3 text-center">
            Popular topics
          </p>
          <div className="grid gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => onQuickAction(action.message)}
                disabled={isLoading}
                className="group surface-card flex items-center justify-between rounded-xl px-4 py-3.5 text-left transition-all duration-200 hover:border-primary/30 hover:shadow-elevated disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{action.icon}</span>
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
