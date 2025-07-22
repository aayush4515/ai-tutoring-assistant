import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const FileUploadIcon = ({ onFileUpload }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const allowedTypes = ['.py', '.cpp'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedTypes.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      return { valid: false, error: 'Please upload only .py or .cpp files.' };
    }
    
    if (file.size > maxFileSize) {
      return { valid: false, error: 'File size must be less than 5MB.' };
    }
    
    return { valid: true };
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validation = validateFile(files[0]);
      
      if (!validation.valid) {
        setUploadStatus('error');
        setTimeout(() => setUploadStatus(null), 3000);
        return;
      }

      setUploadStatus('success');
      onFileUpload(files[0]);
      
      // Clear success status after a moment
      setTimeout(() => setUploadStatus(null), 2000);
    }
    // Reset input value to allow same file selection
    e.target.value = '';
  };

  return (
    <div className="relative">
      <label
        className={`
          w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200
          ${uploadStatus === 'success' 
            ? 'bg-green-100 text-green-600' 
            : uploadStatus === 'error'
            ? 'bg-red-100 text-red-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }
        `}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Plus className="w-5 h-5" />
        <input
          type="file"
          accept=".py,.cpp"
          onChange={handleFileInput}
          className="hidden"
        />
      </label>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-10">
          Upload a .py/.cpp file
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default FileUploadIcon;