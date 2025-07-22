import React, { useState } from 'react';
import { Upload, File, AlertCircle, Check } from 'lucide-react';

const FileUpload = ({ onFileUpload, compact = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleFile = (file) => {
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setUploadStatus('error');
      setErrorMessage(validation.error);
      setTimeout(() => setUploadStatus(null), 3000);
      return;
    }

    setUploadStatus('success');
    setErrorMessage('');
    onFileUpload(file);
    
    // Clear success status after a moment
    setTimeout(() => setUploadStatus(null), 2000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
    // Reset input value to allow same file selection
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <label className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer transition-colors">
          <File className="w-4 h-4" />
          Upload .py/.cpp file
          <input
            type="file"
            accept=".py,.cpp"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
        
        {uploadStatus === 'success' && (
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <Check className="w-4 h-4" />
            <span>Uploaded!</span>
          </div>
        )}
        
        {uploadStatus === 'error' && (
          <div className="flex items-center gap-1 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
          ${isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : uploadStatus === 'success'
            ? 'border-green-400 bg-green-50'
            : uploadStatus === 'error'
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
        `}
      >
        <input
          type="file"
          accept=".py,.cpp"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center gap-3">
          {uploadStatus === 'success' ? (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-green-700 font-medium">File uploaded successfully!</p>
            </>
          ) : uploadStatus === 'error' ? (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-red-700 font-medium">{errorMessage}</p>
              <p className="text-gray-600 text-sm">Please try again with a valid .py or .cpp file.</p>
            </>
          ) : (
            <>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDragging ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Upload className={`w-6 h-6 ${
                  isDragging ? 'text-blue-600' : 'text-gray-500'
                }`} />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {isDragging ? 'Drop your file here' : 'Drop your file here or click to browse'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Supports .py and .cpp files (max 5MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;