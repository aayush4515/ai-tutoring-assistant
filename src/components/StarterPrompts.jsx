import React from 'react';

const StarterPrompts = ({ onPromptClick }) => {
  const prompts = [
    "How do I write a for loop in C++ like in Python?",
    "What's the C++ equivalent of Python lists?",
    "Why do I need to declare variable types in C++?",
    "Can you explain C++ classes compared to Python?"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
      {prompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onPromptClick(prompt)}
          className="text-left p-4 border border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-gray-700 hover:text-gray-900"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};

export default StarterPrompts;