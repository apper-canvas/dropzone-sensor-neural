import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ onClick, children, className, disabled, ...motionProps }) => {
    return (
        <motion.button
            onClick={onClick}
            className={className}
            disabled={disabled}
            {...motionProps}
        >
            {children}
        </motion.button>
    );
};

export default Button;