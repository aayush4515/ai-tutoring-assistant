import Message from './Message';
import LoadingSpinner from './LoadingSpinner';

const MessageList = ({ messages, isLoading, streamingMessageId, onStreamComplete, shouldStopStreaming }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Message 
          key={message.id} 
          message={message} 
          isStreaming={message.id === streamingMessageId}
          onStreamComplete={onStreamComplete}
          shouldStopStreaming={shouldStopStreaming && message.id === streamingMessageId}
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
    </div>
  );
};

export default MessageList;