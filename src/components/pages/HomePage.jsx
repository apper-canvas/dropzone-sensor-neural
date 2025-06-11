import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { fileService } from '@/services';
import FileDropZone from '@/components/organisms/FileDropZone';
import FileUploadList from '@/components/organisms/FileUploadList';
import UploadSessionSummary from '@/components/organisms/UploadSessionSummary';
import FilePreviewModal from '@/components/organisms/FilePreviewModal';
import Input from '@/components/atoms/Input';

function HomePage() {
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

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const getFileIcon = useCallback((type) => {
    if (type.startsWith('image/')) return 'Image';
    if (type === 'application/pdf') return 'FileText';
    if (type.includes('word')) return 'FileText';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'FileSpreadsheet';
    if (type.startsWith('text/')) return 'FileText';
    return 'File';
  }, []);

  const validateFile = useCallback((file) => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`;
    }
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      return 'File size must be less than 50MB';
    }
    return null;
  }, [acceptedTypes]);

  const createFilePreview = useCallback(async (file) => {
    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }
    return null;
  }, []);

  const processFiles = useCallback(async (fileList) => {
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
  }, [validateFile, createFilePreview]);

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
  }, [processFiles]);

  const handleFileSelect = useCallback(async (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      await processFiles(selectedFiles);
    }
    // Reset input value to allow selecting same files again
    e.target.value = '';
  }, [processFiles]);

  const removeFile = useCallback((fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast.success('File removed');
  }, []);

  const uploadFiles = useCallback(async () => {
    const filesToUpload = files.filter(f => f.status === 'pending'); // Only upload pending files
    if (filesToUpload.length === 0) {
      toast.warning('No files to upload');
      return;
    }

    setIsUploading(true);

    try {
      // Create upload session
      const session = await fileService.createUploadSession({
        totalFiles: filesToUpload.length,
        totalSize: filesToUpload.reduce((sum, f) => sum + f.size, 0),
        startTime: Date.now()
      });

      // Upload files one by one
      for (const file of filesToUpload) {
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
        uploadedFiles: filesToUpload.length
      });

      toast.success('All files uploaded successfully!');
    } catch (error) {
      toast.error('Upload session failed');
    } finally {
      setIsUploading(false);
    }
  }, [files]);

  const clearAll = useCallback(() => {
    setFiles([]);
    toast.success('All files cleared');
  }, []);

  const displayValidFiles = files.filter(f => f.status !== 'error');
  const totalSize = displayValidFiles.reduce((sum, f) => sum + f.size, 0);
  const completedFilesCount = files.filter(f => f.status === 'completed').length;
  const uploadProgress = displayValidFiles.length > 0
    ? (completedFilesCount / displayValidFiles.length) * 100
    : 0;
  const filesForUploadButton = files.filter(f => f.status === 'pending'); // Files that are currently pending and eligible for upload button

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
          <UploadSessionSummary
            totalFiles={displayValidFiles.length}
            totalSize={totalSize}
            completedFiles={completedFilesCount}
            uploadProgress={uploadProgress}
            formatFileSize={formatFileSize}
          />
        )}

        {/* Main Drop Zone */}
        <FileDropZone
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileSelect={() => fileInputRef.current?.click()}
          acceptedTypes={acceptedTypes}
        />

        {/* Hidden File Input */}
        <Input
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
              <FileUploadList
                files={files}
                onRemove={removeFile}
                onPreview={setPreviewFile}
                formatFileSize={formatFileSize}
                getFileIcon={getFileIcon}
                onClearAll={clearAll}
                onUploadFiles={uploadFiles}
                isUploading={isUploading}
                validFilesCount={filesForUploadButton.length}
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

export default HomePage;