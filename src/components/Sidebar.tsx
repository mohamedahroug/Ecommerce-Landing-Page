import React from 'react';
import { Chat } from '../types/chat';
import { Plus, MessageSquare, Trash2, Menu, X } from 'lucide-react';

interface SidebarProps {
  chats: Chat[];
  currentChat: Chat | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onClearHistory: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  currentChat,
  onNewChat,
  onSelectChat,
  onClearHistory,
  isOpen,
  onToggle,
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const groupedChats = chats.reduce((groups, chat) => {
    const dateKey = formatDate(chat.updatedAt);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(chat);
    return groups;
  }, {} as Record<string, Chat[]>);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-100 rounded-lg lg:hidden"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } lg:transform-none`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            {Object.keys(groupedChats).length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm">Start a new chat to begin</p>
              </div>
            ) : (
              Object.entries(groupedChats).map(([date, chats]) => (
                <div key={date} className="mb-6">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    {date}
                  </h3>
                  <div className="space-y-1">
                    {chats.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => {
                          onSelectChat(chat.id);
                          onToggle();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 group ${
                          currentChat?.id === chat.id ? 'bg-gray-800' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-sm truncate flex-1">{chat.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {chats.length > 0 && (
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={onClearHistory}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <Trash2 className="w-5 h-5" />
                <span>Clear History</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;