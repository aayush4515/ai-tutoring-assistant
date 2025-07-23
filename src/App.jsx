import React, { useState, useRef, useEffect } from 'react';
import MessageList from './components/MessageList.jsx';
import ChatInput from './components/ChatInput.jsx';
import FileUploadIcon from './components/FileUploadIcon.jsx';
import StarterPrompts from './components/StarterPrompts.jsx';
import { MessageCircle } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const [abortController, setAbortController] = useState(null);
  const [shouldStopStreaming, setShouldStopStreaming] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add a new message to the chat
  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  // Send text prompt to backend
  const handleSendTextPrompt = async (prompt) => {
    if (!prompt.trim()) return;

    // Add user message
    addMessage({
      id: Date.now(),
      type: 'user',
      content: prompt,
      timestamp: new Date()
    });

    setIsLoading(true);
    const botMessageId = Date.now() + 1;
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Add bot response
      const botMessage = {
        id: botMessageId,
        type: 'bot',
        content: data.response,
        timestamp: new Date()
      };
      
      addMessage(botMessage);
      setStreamingMessageId(botMessageId);
    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was cancelled
        addMessage({
          id: botMessageId,
          type: 'bot',
          content: 'Response cancelled by user.',
          timestamp: new Date(),
          isError: true
        });
        return;
      }
      
      console.error('Error sending message:', error);
      
      let errorMessage = 'Sorry, I encountered an error while processing your request. Please try again.';
      
      if (error.name === 'TimeoutError') {
        errorMessage = 'Request timed out. The server may be experiencing high load. Please try again in a moment.';
      } else if (error.message.includes('500')) {
        errorMessage = 'The server is experiencing internal issues. Please try again in a few minutes.';
      } else if (error.message.includes('502') || error.message.includes('503')) {
        errorMessage = 'The server is temporarily unavailable. Please try again in a few minutes.';
      }
      
      addMessage({
        id: botMessageId,
        type: 'bot',
        content: errorMessage,
        timestamp: new Date(),
        isError: true
      });
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  // Handle file sending to backend
  const handleSendFilePrompt = async (file, userPrompt = '') => {
    // Add system message for file sending
    addMessage({
      id: Date.now(),
      type: 'system',
      content: `Uploaded file: ${file.name}${userPrompt ? ` with prompt: "${userPrompt}"` : ''}`,
      timestamp: new Date()
    });

    // Add analyzing message
    addMessage({
      id: Date.now() + 1,
      type: 'system',
      content: 'Analyzing your file...',
      timestamp: new Date()
    });

    setIsLoading(true);
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_prompt', userPrompt);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Add bot analysis response
      addMessage({
        id: Date.now() + 2,
        type: 'bot',
        content: data.response,
        timestamp: new Date()
      });
    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was cancelled
        addMessage({
          id: Date.now() + 2,
          type: 'bot',
          content: 'File analysis cancelled by user.',
          timestamp: new Date(),
          isError: true
        });
        return;
      }
      
      console.error('Error uploading file:', error);
      
      let errorMessage = 'Sorry, I encountered an error while analyzing your file. Please try again.';
      
      if (error.name === 'TimeoutError') {
        errorMessage = 'File upload timed out. Please try with a smaller file or try again later.';
      } else if (error.message.includes('500')) {
        errorMessage = 'The server is experiencing internal issues. Please try uploading your file again in a few minutes.';
      }
      
      addMessage({
        id: Date.now() + 2,
        type: 'bot',
        content: errorMessage,
        timestamp: new Date(),
        isError: true
      });
    } finally {
      setIsLoading(false);
      setAbortController(null);
      setSelectedFile(null);
    }
  };

  // Handle file selection (not sending)
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  // Handle streaming completion
  const handleStreamComplete = () => {
    setStreamingMessageId(null);
    setShouldStopStreaming(false);
  };

  // Handle stop button click
  const handleStop = () => {
    if (abortController) {
      abortController.abort();
    }
    if (streamingMessageId) {
      setShouldStopStreaming(true);
      // Immediately clear streaming state when stopped
      setTimeout(() => {
        setStreamingMessageId(null);
        setShouldStopStreaming(false);
      }, 100);
    }
  };

  // Handle starter prompt click
  const handleStarterPromptClick = (prompt) => {
    handleSendTextPrompt(prompt);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              AI Tutoring Assistant
            </h1>
            <p className="text-sm text-gray-600">
              Get help transitioning from Python to C++
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 pb-32">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to your AI Tutoring Assistant!
              </h2>
              <p className="text-gray-600 mb-6 max-w-md">
                Ask questions about transitioning from Python to C++, or upload your 
                Python (.py) or C++ (.cpp) files for analysis and feedback.
              </p>
              
              {/* Starter Prompts */}
              <div className="mb-6 w-full">
                <StarterPrompts onPromptClick={handleStarterPromptClick} />
              </div>
            </div>
          ) : (
            <>
              <MessageList 
                messages={messages} 
                isLoading={isLoading}
                streamingMessageId={streamingMessageId}
                onStreamComplete={handleStreamComplete}
                shouldStopStreaming={shouldStopStreaming}
              />
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-50 px-4 pb-4 max-w-4xl mx-auto">
          <div className="relative">
            {/* Chat Input */}
            <ChatInput 
              onSendTextPrompt={handleSendTextPrompt}
              onSendFilePrompt={handleSendFilePrompt}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              disabled={isLoading}
              onStop={handleStop}
              canStop={!!abortController || !!streamingMessageId}
            />
            
            {/* File Upload Icon */}
            <div className="absolute bottom-4 left-2">
              <FileUploadIcon onFileSelect={handleFileSelect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;