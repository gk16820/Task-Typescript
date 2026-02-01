import { STORAGE_KEYS } from '../utils/constants';

// Generic storage operations
export const storage = {
    get: <T>(key: string): T | null => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage:`, error);
            return null;
        }
    },

    set: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage:`, error);
        }
    },

    remove: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage:`, error);
        }
    },

    clear: (): void => {
        Object.values(STORAGE_KEYS).forEach((key) => {
            localStorage.removeItem(key);
        });
    },
};

// Initialize storage with default data if empty
export const initializeStorage = (): void => {
    if (!storage.get(STORAGE_KEYS.USERS)) {
        storage.set(STORAGE_KEYS.USERS, []);
    }
    if (!storage.get(STORAGE_KEYS.PROJECTS)) {
        storage.set(STORAGE_KEYS.PROJECTS, []);
    }
    if (!storage.get(STORAGE_KEYS.TASKS)) {
        storage.set(STORAGE_KEYS.TASKS, []);
    }
    if (!storage.get(STORAGE_KEYS.TEAMS)) {
        storage.set(STORAGE_KEYS.TEAMS, []);
    }
    if (!storage.get(STORAGE_KEYS.ACTIVITIES)) {
        storage.set(STORAGE_KEYS.ACTIVITIES, []);
    }
};
