import React, { useState, useRef } from 'react';
import { PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const FileUpload = ({ onFileUpload, maxSize = 10 * 1024 * 1024 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'video/mp4',
    'audio/mp3',
    'application/zip'
  ];

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only images, documents, and media files are allowed.');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit.`);
      return;
    }

    setError('');
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      onFileUpload(response.data);
      setUploadProgress(0);
    } catch (error) {
      console.error('File upload error:', error);
      setError(error.response?.data?.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const clearError = () => {
    setError('');
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept={allowedTypes.join(',')}
      />
      
      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
        ) : (
          <PaperClipIcon className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Upload Progress */}
      {uploading && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
          <div className="text-xs text-gray-600 mb-1">Uploading...</div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">{uploadProgress}%</div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-red-50 border border-red-200 rounded-lg shadow-lg p-3">
          <div className="flex items-start">
            <XMarkIcon className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
