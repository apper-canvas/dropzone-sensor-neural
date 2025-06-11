import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function FileDropZone({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  acceptedTypes
}) {
  const getAcceptedTypesDisplay = () => {
    const typeMap = {
      'image/jpeg': 'JPG',
      'image/png': 'PNG',
      'image/gif': 'GIF',
      'image/webp': 'WebP',
      'application/pdf': 'PDF',
      'text/plain': 'TXT',
      'text/csv': 'CSV',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'application/vnd.ms-excel': 'XLS',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX'
    };

    return acceptedTypes.map(type => typeMap[type] || type.split('/')[1].toUpperCase()).join(', ');
  };

  return (
    <motion.div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      whileHover={{ scale: 1.01 }}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ease-out
        cursor-pointer group overflow-hidden max-w-full
        ${isDragging
          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20 scale-105'
          : 'border-surface-300 hover:border-primary/50 hover:bg-surface-50'
        }
      `}
      onClick={onFileSelect}
    >
      {/* Background gradient effect */}
      <div className={`
        absolute inset-0 transition-opacity duration-200
        ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
      `}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Upload Icon */}
        <motion.div
          animate={isDragging ? { scale: 1.1, rotate: [0, 5, -5, 0] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center"
        >
          <div className={`
            w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200
            ${isDragging
              ? 'gradient-primary shadow-lg'
              : 'bg-surface-100 group-hover:bg-primary/10'
            }
          `}>
            <ApperIcon
              name={isDragging ? "Upload" : "FolderPlus"}
              size={32}
              className={`transition-colors duration-200 ${
                isDragging ? 'text-white' : 'text-surface-400 group-hover:text-primary'
              }`}
            />
          </div>
        </motion.div>

        {/* Text Content */}
        <div className="space-y-3 max-w-md mx-auto">
          <h3 className="text-xl font-heading font-semibold text-surface-900">
            {isDragging ? 'Drop files here' : 'Drag files here'}
          </h3>
          <p className="text-surface-600">
            {isDragging
              ? 'Release to upload your files'
              : 'or click to browse from your device'
            }
          </p>

          {/* File Types */}
          <div className="pt-2">
            <p className="text-sm text-surface-500 break-words">
              Supported formats: {getAcceptedTypesDisplay()}
            </p>
            <p className="text-xs text-surface-400 mt-1">
              Maximum file size: 50MB
            </p>
          </div>
        </div>

        {/* Browse Button */}
        {!isDragging && (
          <motion.div
            className="pt-4"
          >
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg gradient-primary
                            text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              <ApperIcon name="FolderOpen" size={16} />
              <span>Browse Files</span>
            </Button>
          </motion.div>
        )}
      </div>

      {/* Animated border effect for drag state */}
      {isDragging && (
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 pointer-events-none"
        >
          <svg className="absolute inset-0 w-full h-full">
            <rect
              x="2"
              y="2"
              width="calc(100% - 4px)"
              height="calc(100% - 4px)"
              rx="16"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray="10,5"
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}

export default FileDropZone;