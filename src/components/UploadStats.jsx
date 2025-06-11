import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

function UploadStats({ totalFiles, totalSize, completedFiles, uploadProgress }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = [
    {
      icon: 'Files',
      label: 'Total Files',
      value: totalFiles,
      color: 'text-primary'
    },
    {
      icon: 'HardDrive',
      label: 'Total Size',
      value: formatFileSize(totalSize),
      color: 'text-secondary'
    },
    {
      icon: 'CheckCircle2',
      label: 'Completed',
      value: completedFiles,
      color: 'text-success'
    },
    {
      icon: 'TrendingUp',
      label: 'Progress',
      value: `${Math.round(uploadProgress)}%`,
      color: 'text-accent'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-50 rounded-2xl p-6 shadow-sm"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center space-y-2"
          >
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <ApperIcon name={stat.icon} size={20} className={stat.color} />
              </div>
            </div>
            <div>
              <div className={`text-2xl font-heading font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-surface-500">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall Progress Bar */}
      {uploadProgress > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 space-y-2"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-surface-700">Overall Progress</span>
            <span className="text-surface-500">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-surface-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full gradient-progress rounded-full"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default UploadStats;