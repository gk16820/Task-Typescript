import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, Menu } from 'lucide-react';
import { useAuth } from '../../context';
import { Avatar } from '../common';

interface NavbarProps {
    onMenuClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
    const { user } = useAuth();
    const [isDark, setIsDark] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="h-16 bg-white dark:bg-dark-800 border-b border-dark-100 dark:border-dark-700 flex items-center justify-between px-6">
            {/* Left section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                    <Menu className="w-5 h-5 text-dark-600 dark:text-dark-300" />
                </button>

                {/* Search */}
                {/* <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                        type="text"
                        placeholder="Search tasks, projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-80 pl-10 pr-4 py-2.5 bg-dark-50 dark:bg-dark-700 border border-transparent rounded-xl text-dark-800 dark:text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-dark-800 transition-all duration-200"
                    />
                </div> */}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-xl transition-colors"
                >
                    {isDark ? (
                        <Sun className="w-5 h-5 text-amber-500" />
                    ) : (
                        <Moon className="w-5 h-5 text-dark-500" />
                    )}
                </button>

                {/* Notifications */}
                <button className="relative p-2.5 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-xl transition-colors">
                    <Bell className="w-5 h-5 text-dark-500 dark:text-dark-400" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* User */}
                {user && (
                    <div className="flex items-center gap-3 pl-3 border-l border-dark-200 dark:border-dark-600">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-dark-800 dark:text-white">
                                {user.name}
                            </p>
                            <p className="text-xs text-dark-500">{user.email}</p>
                        </div>
                        <Avatar name={user.name} size="md" />
                    </div>
                )}
            </div>
        </header>
    );
};
