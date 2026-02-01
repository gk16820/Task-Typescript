import React from 'react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
    text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
    size = 'md',
    fullScreen = false,
    text,
}) => {
    const sizeStyles = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`
          ${sizeStyles[size]} 
          border-4 border-primary-200 dark:border-primary-900 
          border-t-primary-500 rounded-full animate-spin
        `}
            />
            {text && (
                <p className="text-sm text-dark-500 dark:text-dark-400">{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
};
