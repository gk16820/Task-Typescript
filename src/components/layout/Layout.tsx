import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuth } from '../../context';
import { Loading } from '../common';
import { ProjectForm } from '../projects/ProjectForm';

export const Layout: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const [showProjectModal, setShowProjectModal] = useState(false);

    if (isLoading) {
        return <Loading fullScreen text="Loading..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
            <Sidebar onCreateProject={() => setShowProjectModal(true)} />

            <div className="lg:ml-64 ml-20 min-h-screen flex flex-col">
                <Navbar />

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>

            {showProjectModal && (
                <ProjectForm
                    isOpen={showProjectModal}
                    onClose={() => setShowProjectModal(false)}
                />
            )}
        </div>
    );
};
