import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, DataProvider } from './context';
import { Layout } from './components/layout';
import {
    Login,
    Register,
    Dashboard,
    Projects,
    ProjectDetail,
    Tasks,
    Teams,
    TeamDetail,
    Profile,
} from './pages';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <DataProvider>
                    <Routes>
                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="projects" element={<Projects />} />
                            <Route path="projects/:projectId" element={<ProjectDetail />} />
                            <Route path="tasks" element={<Tasks />} />
                            <Route path="teams" element={<Teams />} />
                            <Route path="teams/:teamId" element={<TeamDetail />} />
                            <Route path="profile" element={<Profile />} />
                        </Route>

                        {/* Catch all */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </DataProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
