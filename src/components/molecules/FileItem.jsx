import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProgressBar from '@/components/atoms/ProgressBar';

const FileItem = ({ file, onRemove, onPreview, formatFileSize, getFileIcon, index }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-success';
            case 'error': return 'text-error';
            case 'uploading': return 'text-info';
            default: return 'text-surface-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return 'CheckCircle2';
            case 'error': return 'XCircle';
            case 'uploading': return 'Loader2';
            default: return 'Clock';
        }
    };

    return (
        <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-surface-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 max-w-full overflow-hidden"
        >
            <div className="flex items-center space-x-4 min-w-0">
                {/* File Icon */}
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center">
                        <ApperIcon
                            name={getFileIcon(file.type)}
                            size={20}
                            className="text-primary"
                        />
                    </div>
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between min-w-0">
                        <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-surface-900 truncate" title={file.name}>
                                {file.name}
                            </h3>
                            <p className="text-sm text-surface-500">
                                {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                            </p>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                            {/* Preview Button for Images */}
                            {file.type.startsWith('image/') && file.preview && (
                                <Button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onPreview(file)}
                                    className="p-2 rounded-lg hover:bg-white text-surface-400 hover:text-primary transition-colors"
                                    title="Preview image"
                                >
                                    <ApperIcon name="Eye" size={16} />
                                </Button>
                            )}

                            {/* Remove Button */}
                            <Button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onRemove(file.id)}
                                disabled={file.status === 'uploading'}
                                className="p-2 rounded-lg hover:bg-white text-surface-400 hover:text-error
                                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Remove file"
                            >
                                <ApperIcon name="Trash2" size={16} />
                            </Button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {(file.status === 'uploading' || file.status === 'completed') && (
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className={getStatusColor(file.status)}>
                                    {file.status === 'completed' ? 'Completed' : 'Uploading...'}
                                </span>
                                <span className="text-surface-500">{file.uploadProgress}%</span>
                            </div>
                            <ProgressBar
                                progress={file.uploadProgress}
                                className="h-2"
                                barClassName="gradient-progress"
                            />
                        </div>
                    )}

                    {/* Status */}
                    <div className="flex items-center space-x-2">
                        <ApperIcon
                            name={getStatusIcon(file.status)}
                            size={16}
                            className={`${getStatusColor(file.status)} ${
                                file.status === 'uploading' ? 'animate-spin' : ''
                            }`}
                        />
                        <span className={`text-sm ${getStatusColor(file.status)}`}>
                            {file.error || file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default FileItem;