import React from 'react';
import { Link } from 'react-router-dom';
import {
    CheckSquare,
    FolderKanban,
    Users,
    Clock,
    TrendingUp,
    ArrowRight,
} from 'lucide-react';
import { useAuth, useData } from '../context';
import { StatsCard, TaskChart, WeeklyProgress, ActivityFeed } from '../components/dashboard';
import { ProjectCard } from '../components/projects';
import { getGreeting } from '../utils/helpers';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { projects, tasks, teams } = useData();

    // Calculate stats
    const taskStats = {
        todo: tasks.filter((t) => t.status === 'todo').length,
        inProgress: tasks.filter((t) => t.status === 'in-progress').length,
        review: tasks.filter((t) => t.status === 'review').length,
        done: tasks.filter((t) => t.status === 'done').length,
    };

    const totalTasks = tasks.length;
    const completedTasks = taskStats.done;
    const activeProjects = projects.filter((p) => p.status === 'active').length;

    // Mock weekly data (in a real app, this would come from the backend)
    const weeklyData = [3, 5, 4, 7, 6, 2, 4];

    const recentProjects = [...projects]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-dark-800 dark:text-white">
                        {getGreeting()}, {user?.name?.split(' ')[0]}! 
                    </h1>
                    <p className="text-dark-500 dark:text-dark-400 mt-1">
                        Here's what's happening with your projects today.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Tasks"
                    value={totalTasks}
                    icon={CheckSquare}
                    color="#6366f1"
                    trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                    title="Completed"
                    value={completedTasks}
                    icon={TrendingUp}
                    color="#10b981"
                    trend={{ value: 8, isPositive: true }}
                />
                <StatsCard
                    title="Active Projects"
                    value={activeProjects}
                    icon={FolderKanban}
                    color="#f59e0b"
                />
                <StatsCard
                    title="Teams"
                    value={teams.length}
                    icon={Users}
                    color="#ec4899"
                />
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TaskChart data={taskStats} />
                    <WeeklyProgress data={weeklyData} />
                </div>
                <ActivityFeed tasks={tasks} limit={5} />
            </div>

            {/* Recent Projects */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-dark-800 dark:text-white">
                        Recent Projects
                    </h2>
                    <Link
                        to="/projects"
                        className="flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium text-sm"
                    >
                        View all
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {recentProjects.length === 0 ? (
                    <div className="bg-white dark:bg-dark-800 rounded-2xl p-12 text-center border border-dark-100 dark:border-dark-700">
                        <FolderKanban className="w-12 h-12 text-dark-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-2">
                            No projects yet
                        </h3>
                        <p className="text-dark-500 mb-4">
                            Create your first project to get started
                        </p>
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                        >
                            Create Project
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
