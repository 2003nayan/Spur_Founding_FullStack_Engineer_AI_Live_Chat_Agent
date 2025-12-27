import { useChat } from './hooks/useChat';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { Toast } from './components/Toast';

function App() {
  const { messages, isLoading, isHistoryLoading, error, sendUserMessage, clearError, clearSession } = useChat();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Sticky */}
      <header className="sticky top-0 z-50 glass border-b border-slate-700/50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold gradient-text">Spur Store</h1>
              <p className="text-xs text-slate-400">Customer Support</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {messages.length > 0 && (
              <button
                onClick={clearSession}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                New Chat
              </button>
            )}
            <span className="flex items-center space-x-1.5 text-xs text-emerald-400">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span>Online</span>
            </span>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto">
        {isHistoryLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-slate-400">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading conversation...</span>
            </div>
          </div>
        ) : (
          <MessageList 
            messages={messages} 
            isLoading={isLoading}
            onQuickAction={sendUserMessage}
          />
        )}
        <ChatInput 
          onSend={sendUserMessage} 
          disabled={isLoading || isHistoryLoading} 
        />
      </main>

      {/* Error Toast */}
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={clearError}
        />
      )}

      {/* Footer */}
      <footer className="text-center py-3 text-xs text-slate-500 border-t border-slate-700/30">
        <p>Spur Store Support • Available 9 AM - 5 PM EST</p>
      </footer>
    </div>
  );
}

export default App;

