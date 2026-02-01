import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types';
import { authService } from '../services';

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Check for existing session on mount
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setState({
            user: currentUser,
            isAuthenticated: !!currentUser,
            isLoading: false,
        });
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            const user = authService.login(credentials);
            if (user) {
                setState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                });
            }
        } catch (error) {
            throw error;
        }
    }, []);

    const register = useCallback(async (data: RegisterData) => {
        try {
            const user = authService.register(data);
            if (user) {
                setState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                });
            }
        } catch (error) {
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    }, []);

    const updateProfile = useCallback(async (updates: Partial<User>) => {
        if (!state.user) return;

        try {
            const updatedUser = authService.updateProfile(state.user.id, updates);
            if (updatedUser) {
                setState((prev) => ({
                    ...prev,
                    user: updatedUser,
                }));
            }
        } catch (error) {
            throw error;
        }
    }, [state.user]);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                register,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
