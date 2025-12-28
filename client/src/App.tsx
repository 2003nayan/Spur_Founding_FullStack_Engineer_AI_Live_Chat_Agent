import { useChat } from './hooks/useChat';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { ChatHeader } from './components/chat/ChatHeader';
import { ChatFooter } from './components/chat/ChatFooter';
import { WelcomeScreen } from './components/chat/WelcomeScreen';
import { QUICK_ACTIONS } from './constants/quickActions';

function App() {
  const { messages, isLoading, isHistoryLoading, error, sendUserMessage, clearSession } = useChat();

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen flex-col bg-background">
      <ChatHeader hasMessages={hasMessages} onNewChat={clearSession} />

      {isHistoryLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading conversation...</span>
          </div>
        </div>
      ) : hasMessages ? (
        <MessageList
          messages={messages}
          isLoading={isLoading}
          quickActions={QUICK_ACTIONS}
          onQuickAction={sendUserMessage}
        />
      ) : (
        <WelcomeScreen
          quickActions={QUICK_ACTIONS}
          onQuickAction={sendUserMessage}
          isLoading={isLoading}
        />
      )}

      <ChatInput onSend={sendUserMessage} disabled={isLoading || isHistoryLoading} />
      <ChatFooter />

      {/* Simple error display */}
      {error && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-in-up">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-destructive text-destructive-foreground shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
