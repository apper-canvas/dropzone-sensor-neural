import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import FileList from '../components/FileList';
import UploadStats from '../components/UploadStats';
import FilePreviewModal from '../components/FilePreviewModal';
import ApperIcon from '../components/ApperIcon';
import { fileService } from '../services';

function Home() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const fileInputRef = useRef(null);

  const acceptedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'text/csv',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'Image';
    if (type === 'application/pdf') return 'FileText';
    if (type.includes('word')) return 'FileText';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'FileSpreadsheet';
    if (type.startsWith('text/')) return 'FileText';
    return 'File';
  };

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`;
    }
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      return 'File size must be less than 50MB';
    }
    return null;
  };

  const createFilePreview = async (file) => {
    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }
    return null;
  };

  const processFiles = async (fileList) => {
    const newFiles = [];
    
    for (const file of Array.from(fileList)) {
      const error = validateFile(file);
      const preview = await createFilePreview(file);
      
      const fileItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        uploadProgress: 0,
        status: error ? 'error' : 'pending',
        error: error,
        preview: preview,
        file: file
      };
      
      newFiles.push(fileItem);
      
      if (error) {
        toast.error(`${file.name}: ${error}`);
      }
    }
    
    setFiles(prev => [...prev, ...newFiles]);
    return newFiles.filter(f => !f.error);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      await processFiles(droppedFiles);
    }
  }, []);

  const handleFileSelect = async (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      await processFiles(selectedFiles);
    }
    // Reset input value to allow selecting same files again
    e.target.value = '';
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast.success('File removed');
  };

  const uploadFiles = async () => {
    const validFiles = files.filter(f => f.status === 'pending');
    if (validFiles.length === 0) {
      toast.warning('No valid files to upload');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create upload session
      const session = await fileService.createUploadSession({
        totalFiles: validFiles.length,
        totalSize: validFiles.reduce((sum, f) => sum + f.size, 0),
        startTime: Date.now()
      });

      // Upload files one by one
      for (const file of validFiles) {
        try {
          // Update status to uploading
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'uploading' } : f
          ));

          // Simulate upload progress
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            setFiles(prev => prev.map(f => 
              f.id === file.id ? { ...f, uploadProgress: progress } : f
            ));
          }

          // Upload file
          await fileService.uploadFile(file);
          
          // Mark as completed
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'completed', uploadProgress: 100 } : f
          ));
          
          toast.success(`${file.name} uploaded successfully`);
        } catch (error) {
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { 
              ...f, 
              status: 'error', 
              error: 'Upload failed',
              uploadProgress: 0 
            } : f
          ));
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      // Complete session
      await fileService.completeUploadSession(session.id, {
        endTime: Date.now(),
        uploadedFiles: validFiles.length
      });

      toast.success('All files uploaded successfully!');
    } catch (error) {
      toast.error('Upload session failed');
    } finally {
      setIsUploading(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    toast.success('All files cleared');
  };

  const validFiles = files.filter(f => f.status !== 'error');
  const totalSize = validFiles.reduce((sum, f) => sum + f.size, 0);
  const completedFiles = files.filter(f => f.status === 'completed');
  const uploadProgress = validFiles.length > 0 
    ? (completedFiles.length / validFiles.length) * 100 
    : 0;

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-surface-900">
            Upload Your Files
          </h1>
          <p className="text-lg text-surface-600 max-w-2xl mx-auto">
            Drag and drop your files or click to browse. Supports images, documents, and more.
          </p>
        </div>

        {/* Upload Stats */}
        {files.length > 0 && (
          <UploadStats
            totalFiles={validFiles.length}
            totalSize={totalSize}
            completedFiles={completedFiles.length}
            uploadProgress={uploadProgress}
          />
        )}

        {/* Main Drop Zone */}
        <MainFeature
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileSelect={() => fileInputRef.current?.click()}
          acceptedTypes={acceptedTypes}
        />

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          accept={acceptedTypes.join(',')}
          className="hidden"
        />

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-semibold text-surface-900">
                  Files ({files.length})
                </h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={clearAll}
                    disabled={isUploading}
                    className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 
                             disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Clear All
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={uploadFiles}
                    disabled={validFiles.length === 0 || isUploading}
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
                  </motion.button>
                </div>
              </div>

              <FileList
                files={files}
                onRemove={removeFile}
                onPreview={setPreviewFile}
                formatFileSize={formatFileSize}
                getFileIcon={getFileIcon}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* File Preview Modal */}
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      </motion.div>
    </div>
  );
}

export default Home;