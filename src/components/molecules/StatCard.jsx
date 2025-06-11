import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ icon, label, value, color, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center space-y-2"
        >
            <div className="flex justify-center">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <ApperIcon name={icon} size={20} className={color} />
                </div>
            </div>
            <div>
                <div className={`text-2xl font-heading font-bold ${color}`}>
                    {value}
                </div>
                <div className="text-sm text-surface-500">{label}</div>
            </div>
        </motion.div>
    );
};

export default StatCard;