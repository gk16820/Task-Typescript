import { v4 as uuidv4 } from 'uuid';
import { AVATAR_COLORS } from './constants';

// Generate unique ID
export const generateId = (): string => uuidv4();

// Format date for display
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

// Format relative time
export const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formatDate(dateString);
};

// Get initials from name
export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Get avatar color based on string
export const getAvatarColor = (str: string): string => {
    const index = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
};

// Check if date is overdue
export const isOverdue = (dateString?: string): boolean => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return date < now;
};

// Check if date is today
export const isToday = (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

// Simple hash function for password (demo only - not secure for production)
export const hashPassword = (password: string): string => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return `hashed_${Math.abs(hash).toString(16)}`;
};

// Validate email
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

// Get greeting based on time
export const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
};

// Calculate task completion percentage
export const calculateCompletionPercentage = (completed: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
};

// Group tasks by status
export const groupTasksByStatus = <T extends { status: string }>(tasks: T[]): Record<string, T[]> => {
    return tasks.reduce((acc, task) => {
        if (!acc[task.status]) {
            acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
    }, {} as Record<string, T[]>);
};

// Sort by date (newest first)
export const sortByDateDesc = <T extends { createdAt: string }>(items: T[]): T[] => {
    return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Sort by date (oldest first)
export const sortByDateAsc = <T extends { createdAt: string }>(items: T[]): T[] => {
    return [...items].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};
