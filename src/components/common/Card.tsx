import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    padding = 'md',
    hover = false,
}) => {
    const paddingStyles = {
        none: '',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-6',
    };

    return (
        <div
            className={`
        bg-white dark:bg-dark-800 rounded-2xl 
        border border-dark-100 dark:border-dark-700
        shadow-card transition-all duration-300
        ${hover ? 'hover:shadow-card-hover hover:border-primary-200 dark:hover:border-primary-800 cursor-pointer' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
