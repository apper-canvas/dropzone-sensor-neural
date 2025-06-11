import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import FileItem from '@/components/molecules/FileItem';
import Button from '@/components/atoms/Button';

function FileUploadList({ files, onRemove, onPreview, formatFileSize, getFileIcon, onClearAll, onUploadFiles, isUploading, validFilesCount }) {
  return (
    <div className="space-y-3 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-surface-900">
          Files ({files.length})
        </h2>
        <div className="flex items-center space-x-3">
          <Button
            onClick={onClearAll}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-900
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear All
          </Button>
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUploadFiles}
            disabled={validFilesCount === 0 || isUploading}
            className="px-6 py-3 rounded-lg gradient-primary text-white font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
                       hover:shadow-xl transition-shadow"
          >
            {isUploading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ApperIcon name="Upload" size={16} />
                <span>Upload Files</span>
              </div>
            )}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {files.map((file, index) => (
          <FileItem
            key={file.id}
            file={file}
            onRemove={onRemove}
            onPreview={onPreview}
            formatFileSize={formatFileSize}
            getFileIcon={getFileIcon}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default FileUploadList;