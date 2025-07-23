import React, { useState } from 'react';
import { Send, Square, X, FileText } from 'lucide-react';

const ChatInput = ({ onSendTextPrompt, onSendFilePrompt, selectedFile, setSelectedFile, disabled, onStop, canStop }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    
    if (selectedFile) {
      // Send file
      onSendFilePrompt(selectedFile);
      setMessage('');
    } else if (message.trim()) {
      // Send text message
      onSendTextPrompt(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const canSend = !disabled && (message.trim() || selectedFile);

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1 relative">
        {/* Selected File Display */}
        {selectedFile && (
          <div className="absolute top-2 left-4 right-12 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-center gap-2 z-10">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800 truncate flex-1">{selectedFile.name}</span>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-blue-600 hover:text-blue-800 p-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={selectedFile ? "Press send to analyze the file or type a message..." : "Ask a question about Python to C++ transition..."}
          disabled={disabled}
          rows={1}
          className={`w-full px-4 pb-8 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${selectedFile ? 'pt-16' : 'pt-4'}`}
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
        
        {/* Send/Stop Button */}
        {canStop ? (
          <button
            type="button"
            onClick={onStop}
            className="absolute right-2 bottom-4 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            <Square className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            className="absolute right-2 bottom-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default ChatInput;