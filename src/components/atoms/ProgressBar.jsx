import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, className, barClassName }) => {
    return (
        <div className={`w-full bg-surface-200 rounded-full overflow-hidden ${className}`}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className={`h-full rounded-full ${barClassName}`}
            />
        </div>
    );
};

export default ProgressBar;