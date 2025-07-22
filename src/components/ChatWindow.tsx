import React, { useEffect, useRef } from 'react';
import { Chat, Message as MessageType } from '../types/chat';
import Message from './Message';
import LoadingDots from './LoadingDots';
import ChatInput from './ChatInput';
import { RotateCcw, Trash2 } from 'lucide-react';

interface ChatWindowProps {
  chat: Chat | null;
  onSendMessage: (message: string) => void;
  onRegenerateResponse: () => void;
  onClearChat: () => void;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  onSendMessage,
  onRegenerateResponse,
  onClearChat,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages, isLoading]);

  const lastMessage = chat?.messages[chat.messages.length - 1];
  const canRegenerate = lastMessage && lastMessage.role === 'assistant';

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            {chat?.title || 'ChatGPT Clone'}
          </h1>
          {chat && chat.messages.length > 0 && (
            <div className="flex items-center gap-2">
              {canRegenerate && (
                <button
                  onClick={onRegenerateResponse}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Regenerate
                </button>
              )}
              <button
                onClick={onClearChat}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {!chat || chat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">AI</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                How can I help you today?
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Start a conversation by typing your message below. I'm here to help with questions, creative tasks, analysis, and more.
              </p>
            </div>
          </div>
        ) : (
          <>
            {chat.messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="bg-gray-50">
                <LoadingDots />
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0">
        <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatWindow;