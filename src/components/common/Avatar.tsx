import React from 'react';
import { getInitials, getAvatarColor } from '../../utils/helpers';

interface AvatarProps {
    name: string;
    src?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    name,
    src,
    size = 'md',
    className = '',
}) => {
    const sizeStyles = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
    };

    const bgColor = getAvatarColor(name);

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`${sizeStyles[size]} rounded-full object-cover ring-2 ring-white dark:ring-dark-800 ${className}`}
            />
        );
    }

    return (
        <div
            className={`
        ${sizeStyles[size]} ${bgColor}
        rounded-full flex items-center justify-center 
        text-white font-semibold 
        ring-2 ring-white dark:ring-dark-800
        ${className}
      `}
        >
            {getInitials(name)}
        </div>
    );
};

interface AvatarGroupProps {
    users: { name: string; src?: string }[];
    max?: number;
    size?: 'xs' | 'sm' | 'md';
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
    users,
    max = 4,
    size = 'sm',
}) => {
    const displayUsers = users.slice(0, max);
    const remainingCount = users.length - max;

    return (
        <div className="flex -space-x-2">
            {displayUsers.map((user, index) => (
                <Avatar
                    key={index}
                    name={user.name}
                    src={user.src}
                    size={size}
                />
            ))}
            {remainingCount > 0 && (
                <div
                    className={`
            ${size === 'xs' ? 'w-6 h-6 text-xs' : size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'}
            rounded-full bg-dark-200 dark:bg-dark-600 
            flex items-center justify-center 
            text-dark-600 dark:text-dark-200 font-medium
            ring-2 ring-white dark:ring-dark-800
          `}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
};
