// Storage keys
export const STORAGE_KEYS = {
    USERS: 'taskflow_users',
    CURRENT_USER: 'taskflow_current_user',
    PROJECTS: 'taskflow_projects',
    TASKS: 'taskflow_tasks',
    TEAMS: 'taskflow_teams',
    ACTIVITIES: 'taskflow_activities',
} as const;

// Project colors
export const PROJECT_COLORS = [
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#14b8a6', // Teal
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
];

// Team colors
export const TEAM_COLORS = [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#10b981',
    '#f59e0b',
    '#3b82f6',
];

// Task status configuration
export const TASK_STATUS_CONFIG = {
    'todo': {
        label: 'To Do',
        color: 'bg-slate-500',
        bgColor: 'bg-slate-100 dark:bg-slate-900/30',
        textColor: 'text-slate-700 dark:text-slate-300',
    },
    'in-progress': {
        label: 'In Progress',
        color: 'bg-blue-500',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        textColor: 'text-blue-700 dark:text-blue-300',
    },
    'review': {
        label: 'In Review',
        color: 'bg-purple-500',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        textColor: 'text-purple-700 dark:text-purple-300',
    },
    'done': {
        label: 'Done',
        color: 'bg-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        textColor: 'text-green-700 dark:text-green-300',
    },
} as const;

// Task priority configuration
export const TASK_PRIORITY_CONFIG = {
    'low': {
        label: 'Low',
        color: 'bg-blue-500',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        textColor: 'text-blue-700 dark:text-blue-300',
    },
    'medium': {
        label: 'Medium',
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        textColor: 'text-yellow-700 dark:text-yellow-300',
    },
    'high': {
        label: 'High',
        color: 'bg-orange-500',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        textColor: 'text-orange-700 dark:text-orange-300',
    },
    'urgent': {
        label: 'Urgent',
        color: 'bg-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        textColor: 'text-red-700 dark:text-red-300',
    },
} as const;

// Default avatar colors
export const AVATAR_COLORS = [
    'bg-primary-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-blue-500',
];
