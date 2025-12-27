import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../api/chat';

// Quick action buttons like WhatsApp Business
const QUICK_ACTIONS = [
  { label: '📦 Return Policy', message: 'What is your return policy?' },
  { label: '🚚 Shipping Options', message: 'What are your shipping options and costs?' },
  { label: '🕐 Support Hours', message: 'What are your support hours?' },
  { label: '🛍️ About Spur Store', message: 'Tell me about Spur Store services' },
];

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onQuickAction?: (message: string) => void;
}

export function MessageList({ messages, isLoading, onQuickAction }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleQuickAction = (actionMessage: string) => {
    if (onQuickAction && !isLoading) {
      onQuickAction(actionMessage);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {/* Welcome screen when no messages */}
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold gradient-text mb-2">
            Welcome to Spur Store Support
          </h2>
          <p className="text-slate-400 max-w-md mb-6">
            Hi! I'm Ria, your AI support assistant. Ask me about our products, 
            shipping, returns, or anything else I can help with.
          </p>
          
          {/* Quick action buttons */}
          <div className="flex flex-wrap justify-center gap-2 max-w-lg">
            {QUICK_ACTIONS.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.message)}
                className="px-4 py-2 rounded-full glass border border-slate-600/50 text-sm text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Message list */}
      {messages.map((message, index) => (
        <div key={message.id}>
          <div
            className={`message-enter flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {message.sender === 'ai' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mr-3 shadow-md">
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
              </div>
            )}
            
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                  : 'glass text-slate-100 rounded-bl-md'
              }`}
            >
              {message.sender === 'ai' ? (
                <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-blue-300">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              )}
              <span className={`text-xs mt-1 block ${
                message.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
              }`}>
                {new Date(message.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>

            {message.sender === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center ml-3 shadow-md">
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Quick action buttons after EVERY AI message */}
          {message.sender === 'ai' && !isLoading && index === messages.length - 1 && (
            <div className="flex justify-start ml-11 mt-2">
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action, actionIndex) => (
                  <button
                    key={actionIndex}
                    onClick={() => handleQuickAction(action.message)}
                    className="px-3 py-1.5 rounded-full border border-slate-600/50 text-xs text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Typing indicator */}
      {isLoading && (
        <div className="flex justify-start message-enter">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mr-3 shadow-md">
            <svg 
              className="w-4 h-4 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
          </div>
          <div className="glass px-4 py-3 rounded-2xl rounded-bl-md shadow-md">
            <div className="flex items-center space-x-1">
              <span className="text-sm text-slate-400 mr-2">Ria is typing</span>
              <span className="typing-dot w-2 h-2 bg-blue-400 rounded-full"></span>
              <span className="typing-dot w-2 h-2 bg-blue-400 rounded-full"></span>
              <span className="typing-dot w-2 h-2 bg-blue-400 rounded-full"></span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
