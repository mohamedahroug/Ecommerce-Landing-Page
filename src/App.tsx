import React, { useState } from 'react';
import { ChatProvider } from './contexts/ChatContext';
import { useChatContext } from './contexts/ChatContext';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { Message } from './types/chat';

const AppContent: React.FC = () => {
  const {
    chats,
    currentChat,
    createNewChat,
    selectChat,
    addMessage,
    clearCurrentChat,
    clearAllChats,
    regenerateResponse,
    isLoading,
  } = useChatContext();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSendMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // If no current chat, create one
    if (!currentChat) {
      createNewChat();
    }

    addMessage(message);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        chats={chats}
        currentChat={currentChat}
        onNewChat={createNewChat}
        onSelectChat={selectChat}
        onClearHistory={clearAllChats}
        isOpen={isSidebarOpen}
        onToggle={handleToggleSidebar}
      />
      <div className="flex-1 flex flex-col lg:ml-0">
        <ChatWindow
          chat={currentChat}
          onSendMessage={handleSendMessage}
          onRegenerateResponse={regenerateResponse}
          onClearChat={clearCurrentChat}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
};

export default App;