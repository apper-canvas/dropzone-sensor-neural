import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';
import ProgressBar from '@/components/atoms/ProgressBar';

function UploadSessionSummary({ totalFiles, totalSize, completedFiles, uploadProgress, formatFileSize }) {
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
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            index={index}
          />
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
          <ProgressBar
            progress={uploadProgress}
            className="h-3"
            barClassName="gradient-progress"
          />
        </motion.div>
      )}
    </motion.div>
  );
}

export default UploadSessionSummary;