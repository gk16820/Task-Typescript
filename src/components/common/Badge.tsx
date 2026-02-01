import React from 'react';
import { TaskPriority, TaskStatus } from '../../types';
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG } from '../../utils/constants';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    className = '',
}) => {
    const variantStyles = {
        primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
        success: 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        default: 'bg-dark-100 text-dark-700 dark:bg-dark-700 dark:text-dark-300',
    };

    return (
        <span
            className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
        >
            {children}
        </span>
    );
};

interface StatusBadgeProps {
    status: TaskStatus;
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
    const config = TASK_STATUS_CONFIG[status];

    return (
        <span
            className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${config.bgColor} ${config.textColor}
        ${className}
      `}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${config.color}`} />
            {config.label}
        </span>
    );
};

interface PriorityBadgeProps {
    priority: TaskPriority;
    className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
    const config = TASK_PRIORITY_CONFIG[priority];

    return (
        <span
            className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${config.bgColor} ${config.textColor}
        ${className}
      `}
        >
            {config.label}
        </span>
    );
};
