import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, leftIcon, rightIcon, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
              w-full px-4 py-3 bg-white dark:bg-dark-800 
              border rounded-xl text-dark-800 dark:text-white 
              placeholder-dark-400 dark:placeholder-dark-500
              focus:outline-none focus:ring-2 focus:border-transparent 
              transition-all duration-200
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${error
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-dark-200 dark:border-dark-600 focus:ring-primary-500'
                            }
              ${className}
            `}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-dark-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
