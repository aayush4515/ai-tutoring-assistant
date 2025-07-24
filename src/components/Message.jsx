import React from 'react';
import StreamingMessage from './StreamingMessage.jsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Bot, Info, FileText, Code2 } from 'lucide-react';

// Helper function to get file icon based on type
const getFileIcon = (fileType) => {
  switch (fileType) {
    case 'python':
      return <FileText className="w-5 h-5 text-white" />;
    case 'cpp':
      return <Code2 className="w-5 h-5 text-white" />;
    default:
      return <FileText className="w-5 h-5 text-white" />;
  }
};

const Message = ({ message, isStreaming = false, onStreamComplete, shouldStopStreaming = false }) => {
  const { type, content, timestamp, isError, attachedFile } = message;

  // Custom renderer for code blocks
  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline && language ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={language}
          PreTag="div"
          className="rounded-lg my-4 text-sm"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    table({ children }) {
      return (
        <div className="overflow-x-auto my-6">
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg">
            {children}
          </table>
        </div>
      );
    },
    thead({ children }) {
      return (
        <thead className="bg-gray-50">
          {children}
        </thead>
      );
    },
    tbody({ children }) {
      return (
        <tbody className="bg-white">
          {children}
        </tbody>
      );
    },
    tr({ children }) {
      return (
        <tr className="border-b border-gray-200">
          {children}
        </tr>
      );
    },
    th({ children }) {
      return (
        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300 last:border-r-0">
          {children}
        </th>
      );
    },
    td({ children }) {
      return (
        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300 last:border-r-0">
          {children}
        </td>
      );
    },
    hr({ children, ...props }) {
      return (
        <hr className="my-8 border-gray-300 border-t-2" {...props} />
      );
    },
    h1({ children }) {
      return (
        <h1 className="text-xl font-bold text-gray-900 mb-4 mt-6">
          {children}
        </h1>
      );
    },
    h2({ children }) {
      return (
        <h2 className="text-lg font-bold text-gray-900 mb-3 mt-5">
          {children}
        </h2>
      );
    },
    h3({ children }) {
      return (
        <h3 className="text-base font-bold text-gray-900 mb-2 mt-4">
          {children}
        </h3>
      );
    },
    ul({ children }) {
      return (
        <ul className="list-disc mb-6 space-y-2 text-gray-800 font-bold" style={{ paddingLeft: '3ch' }}>
          {children}
        </ul>
      );
    },
    ol({ children }) {
      return (
        <ol className="list-decimal mb-6 space-y-2 text-gray-800" style={{ paddingLeft: '2ch' }}>
          {children}
        </ol>
      );
    },
    li({ children }) {
     // Check if this list item contains only bold text (likely a subheader)
     const childrenArray = React.Children.toArray(children);
     const isBoldSubheader = childrenArray.length === 1 && 
       childrenArray[0]?.props?.children && 
       typeof childrenArray[0].props.children === 'string' &&
       childrenArray[0].props.children.endsWith(':');
     
     // If it's a bold subheader, render without bullet point
     if (isBoldSubheader) {
       return (
         <div className="font-bold text-gray-900 mt-4 mb-2">
           {children}
         </div>
       );
     }
     
      return (
        <li className="text-gray-800 leading-relaxed">
          {children && children.toString().trim() ? children : null}
        </li>
      );
    },
  };

  const getMessageStyles = () => {
    switch (type) {
      case 'user':
        return {
          container: 'flex justify-end',
          bubble: 'bg-blue-600 text-white rounded-2xl px-4 py-3 max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl',
          icon: null
        };
      case 'bot':
        return {
          container: 'flex justify-start',
          bubble: `${isError ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'} rounded-2xl px-4 py-3 shadow-sm border max-w-xs sm:max-w-md lg:max-w-2xl xl:max-w-4xl`,
          icon: <Bot className={`w-6 h-6 ${isError ? 'text-red-600' : 'text-blue-600'}`} />
        };
      case 'system':
        return {
          container: 'flex justify-center',
          bubble: 'bg-gray-100 text-gray-700 rounded-full px-4 py-2 text-sm',
          icon: <Info className="w-4 h-4 text-gray-500" />
        };
      default:
        return {
          container: 'flex justify-start',
          bubble: 'bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200',
          icon: null
        };
    }
  };

  const styles = getMessageStyles();

  return (
    <div className={styles.container}>
      <div className="flex items-start gap-2 max-w-full">
        {/* Avatar/Icon */}
        {styles.icon && (
          <div className={`flex-shrink-0 mt-1 ${type === 'system' ? 'self-center' : ''}`}>
            {type === 'user' ? (
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            ) : (
              styles.icon
            )}
          </div>
        )}
        
        {/* Message Bubble */}
        <div className={styles.bubble}>
          {type === 'system' ? (
            <span>{content}</span>
          ) : type === 'user' ? (
            <div>
              {/* Show attached file if present */}
              {attachedFile && (
                <div className="mb-3 p-3 bg-gray-800 rounded-xl border border-gray-600 max-w-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      {getFileIcon(attachedFile.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {attachedFile.name}
                      </div>
                      <div className="text-gray-400 text-xs uppercase">
                        {attachedFile.type === 'python' ? 'PYTHON' : 'C++'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {content && <p className="whitespace-pre-wrap">{content}</p>}
            </div>
          ) : (
            isStreaming ? (
            <div className={`prose prose-sm max-w-none ${isError ? 'text-red-800' : 'text-gray-800'} prose-p:mb-6 prose-headings:mb-4 prose-headings:mt-8 prose-headings:font-semibold prose-ul:mb-6 prose-ol:mb-6 prose-li:mb-2 prose-pre:mb-6 prose-blockquote:mb-6 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-strong:font-semibold prose-table:my-6 prose-hr:my-8 prose-hr:border-gray-300`}>
              <StreamingMessage content={content} onComplete={onStreamComplete} shouldStop={shouldStopStreaming} />
            </div>
            ) : (
              <div className={`prose prose-sm max-w-none ${isError ? 'text-red-800' : 'text-gray-800'} prose-p:mb-6 prose-ul:mb-6 prose-ol:mb-6 prose-li:mb-2 prose-pre:mb-6 prose-pre:mt-4 prose-blockquote:mb-6 prose-blockquote:mt-4 prose-table:my-6 prose-strong:font-semibold prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono`}>
                <ReactMarkdown 
                  components={renderers}
                  remarkPlugins={[remarkGfm]}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )
          )}
          
          {/* Timestamp */}
          {timestamp && type !== 'system' && (
            <div className={`text-xs mt-2 ${type === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;