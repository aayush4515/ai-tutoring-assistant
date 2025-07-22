import React from 'react';
import Message from './Message.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import { Square } from 'lucide-react';

const MessageList = ({ messages, isLoading, streamingMessageId, onStreamComplete, onStop, canStop }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Message 
          key={message.id} 
          message={message} 
          isStreaming={message.id === streamingMessageId}
          onStreamComplete={onStreamComplete}
        />
      ))}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200 max-w-xs">
            <div className="flex items-center gap-2">
              <LoadingSpinner />
              <span className="text-gray-600 text-sm">Thinking...</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Stop button */}
      {canStop && (
        <div className="flex justify-center">
          <button
            onClick={onStop}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm font-medium"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageList;