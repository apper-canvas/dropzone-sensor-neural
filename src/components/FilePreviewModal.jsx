import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import ApperIcon from './ApperIcon';

function FilePreviewModal({ file, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (file) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [file, onClose]);

  if (!file || !file.preview) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-surface-200">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Image" size={18} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading font-semibold text-surface-900 truncate" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-sm text-surface-500">
                  {file.type} • {Math.round(file.size / 1024)} KB
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors flex-shrink-0"
            >
              <ApperIcon name="X" size={20} />
            </motion.button>
          </div>

          {/* Image Preview */}
          <div className="p-6 flex items-center justify-center bg-surface-50 min-h-[400px] max-h-[70vh] overflow-auto">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={file.preview}
              alt={file.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-surface-200 bg-surface-50">
            <div className="text-sm text-surface-500">
              Press ESC to close
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 rounded-lg gradient-primary text-white font-medium shadow-sm hover:shadow-md transition-shadow"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default FilePreviewModal;