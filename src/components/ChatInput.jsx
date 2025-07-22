import React, { useState } from 'react';
import { Send, Square } from 'lucide-react';

const ChatInput = ({ onSendMessage, disabled, onStop, canStop }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="space-y-3">
      {/* Stop Button */}
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
      
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question about Python to C++ transition..."
          disabled={disabled}
          rows={1}
          className="w-full px-4 pt-4 pb-8 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          style={{
            minHeight: '96px',
            maxHeight: '200px',
          }}
          onInput={(e) => {
            // Auto-resize textarea
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
          }}
        />
        
        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="absolute right-2 bottom-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      </form>
    </div>
  );
};

export default ChatInput;