import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Plus,
} from 'lucide-react';
import { useAuth } from '../../context';
import { Avatar } from '../common';

interface SidebarProps {
    onCreateProject?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCreateProject }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/projects', icon: FolderKanban, label: 'Projects' },
        { path: '/tasks', icon: CheckSquare, label: 'My Tasks' },
        { path: '/teams', icon: Users, label: 'Teams' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside
            className={`
        fixed left-0 top-0 h-full bg-white dark:bg-dark-800 
        border-r border-dark-100 dark:border-dark-700
        flex flex-col transition-all duration-300 z-40
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-dark-100 dark:border-dark-700">
                {!isCollapsed && (
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <CheckSquare className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">TaskFlow</span>
                    </Link>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5 text-dark-500" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-dark-500" />
                    )}
                </button>
            </div>

            {/* Quick Action */}
            <div className="p-4">
                <button
                    onClick={onCreateProject}
                    className={`
            w-full flex items-center justify-center gap-2 
            bg-gradient-to-r from-primary-500 to-primary-600 
            text-white font-semibold rounded-xl py-3
            hover:from-primary-600 hover:to-primary-700 
            transition-all duration-200 shadow-lg hover:shadow-xl
            ${isCollapsed ? 'px-3' : 'px-4'}
          `}
                >
                    <Plus className="w-5 h-5" />
                    {!isCollapsed && <span>New Project</span>}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`
              flex items-center gap-3 px-4 py-3 rounded-xl font-medium
              transition-all duration-200
              ${isActive(item.path)
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                : 'text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700'
                            }
              ${isCollapsed ? 'justify-center' : ''}
            `}
                        title={isCollapsed ? item.label : undefined}
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>

            {/* User Profile with Dropdown */}
            <div className="p-4 border-t border-dark-100 dark:border-dark-700">
                <div className="relative">
                    {/* Dropdown Menu - Positioned Above */}
                    {!isCollapsed && isProfileDropdownOpen && (
                        <div className="absolute bottom-full left-4 right-4 mb-2 py-1 bg-white dark:bg-dark-700 rounded-lg shadow-lg border border-dark-100 dark:border-dark-600 animate-fadeIn">
                            <Link
                                to="/profile"
                                onClick={() => setIsProfileDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-600 transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </Link>
                            <button
                                onClick={() => {
                                    setIsProfileDropdownOpen(false);
                                    logout();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}

                    {/* Profile Section */}
                    <div
                        onClick={() => !isCollapsed && setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                        className={`
            flex items-center gap-3 p-3 rounded-xl
            hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors 
            ${isCollapsed ? 'justify-center' : 'cursor-pointer'}
          `}
                    >
                        {user && <Avatar name={user.name} size="sm" />}
                        {!isCollapsed && user && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-dark-800 dark:text-white truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-dark-500 truncate">{user.email}</p>
                            </div>
                        )}
                    </div>

                    {/* Collapsed state - show logout icon only */}
                    {isCollapsed && (
                        <button
                            onClick={logout}
                            className="w-full mt-2 flex items-center justify-center p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};
