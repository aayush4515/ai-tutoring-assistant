import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const StreamingMessage = ({ content, onComplete, shouldStop }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    if (shouldStop && !isStopped) {
      setIsStopped(true);
      // Don't call onComplete when stopped - just halt
      return;
    }

    if (currentIndex < content.length && !isStopped) {
      const timer = setTimeout(() => {
        setDisplayedContent(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 3.2); // Adjust speed here (lower = faster)

      return () => clearTimeout(timer);
    } else if (currentIndex >= content.length && !isStopped) {
      onComplete();
    }
  }, [currentIndex, content, onComplete, shouldStop, isStopped]);

  // Custom renderer for code blocks and tables
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

  return (
    <div className="prose prose-sm max-w-none text-gray-800 prose-p:mb-6 prose-ul:mb-6 prose-ol:mb-6 prose-li:mb-2 prose-pre:mb-6 prose-pre:mt-4 prose-blockquote:mb-6 prose-blockquote:mt-4 prose-table:my-6 prose-strong:font-semibold prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono">
      <ReactMarkdown 
        components={renderers}
        remarkPlugins={[remarkGfm]}
        urlTransform={(url) => url}
      >
        {displayedContent}
      </ReactMarkdown>
    </div>
  );
};

export default StreamingMessage;