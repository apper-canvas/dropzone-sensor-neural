import React from 'react';

const Input = React.forwardRef(({ type = 'text', className, ...props }, ref) => {
    return (
        <input
            ref={ref}
            type={type}
            className={className}
            {...props}
        />
    );
});

// Add display name for better debugging
Input.displayName = 'Input';

export default Input;