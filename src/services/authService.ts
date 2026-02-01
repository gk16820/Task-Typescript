import { User, LoginCredentials, RegisterData } from '../types';
import { storage } from './storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId, hashPassword } from '../utils/helpers';

export const authService = {
    // Register a new user
    register: (data: RegisterData): User | null => {
        const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];

        // Check if email already exists
        const existingUser = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const newUser: User = {
            id: generateId(),
            email: data.email.toLowerCase(),
            name: data.name,
            createdAt: new Date().toISOString(),
        };

        // Store user with hashed password
        const userWithPassword = {
            ...newUser,
            passwordHash: hashPassword(data.password),
        };

        users.push(userWithPassword as any);
        storage.set(STORAGE_KEYS.USERS, users);
        storage.set(STORAGE_KEYS.CURRENT_USER, newUser);

        return newUser;
    },

    // Login user
    login: (credentials: LoginCredentials): User | null => {
        const users = storage.get<any[]>(STORAGE_KEYS.USERS) || [];

        const user = users.find(
            (u) =>
                u.email.toLowerCase() === credentials.email.toLowerCase() &&
                u.passwordHash === hashPassword(credentials.password)
        );

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const { passwordHash, ...userWithoutPassword } = user;
        storage.set(STORAGE_KEYS.CURRENT_USER, userWithoutPassword);

        return userWithoutPassword;
    },

    // Logout user
    logout: (): void => {
        storage.remove(STORAGE_KEYS.CURRENT_USER);
    },

    // Get current user
    getCurrentUser: (): User | null => {
        return storage.get<User>(STORAGE_KEYS.CURRENT_USER);
    },

    // Update user profile
    updateProfile: (userId: string, updates: Partial<User>): User | null => {
        const users = storage.get<any[]>(STORAGE_KEYS.USERS) || [];
        const userIndex = users.findIndex((u) => u.id === userId);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        const updatedUser = {
            ...users[userIndex],
            ...updates,
        };

        users[userIndex] = updatedUser;
        storage.set(STORAGE_KEYS.USERS, users);

        const { passwordHash, ...userWithoutPassword } = updatedUser;
        storage.set(STORAGE_KEYS.CURRENT_USER, userWithoutPassword);

        return userWithoutPassword;
    },

    // Get user by ID
    getUserById: (userId: string): User | null => {
        const users = storage.get<any[]>(STORAGE_KEYS.USERS) || [];
        const user = users.find((u) => u.id === userId);
        if (!user) return null;

        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },

    // Get all users (for team member selection)
    getAllUsers: (): User[] => {
        const users = storage.get<any[]>(STORAGE_KEYS.USERS) || [];
        return users.map(({ passwordHash, ...user }) => user);
    },
};
