import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useData, useAuth } from '../context';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { Button, Input, Select } from '../components/common';
import { Task, TaskStatus, TaskPriority } from '../types';
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG } from '../utils/constants';

export const Tasks: React.FC = () => {
    const { user } = useAuth();
    const { tasks, projects } = useData();
    const [showForm, setShowForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');

    // Get user's tasks (assigned to them)
    const myTasks = tasks.filter((t) => t.assigneeId === user?.id);

    const filteredTasks = myTasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const handleEdit = (task: Task) => {
        setSelectedTask(task);
        setShowForm(true);
    };

    const handleCreate = () => {
        setSelectedTask(undefined);
        setShowForm(true);
    };

    // Group tasks by status
    const groupedTasks = {
        todo: filteredTasks.filter((t) => t.status === 'todo'),
        'in-progress': filteredTasks.filter((t) => t.status === 'in-progress'),
        review: filteredTasks.filter((t) => t.status === 'review'),
        done: filteredTasks.filter((t) => t.status === 'done'),
    };

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'todo', label: 'To Do' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'review', label: 'In Review' },
        { value: 'done', label: 'Done' },
    ];

    const priorityOptions = [
        { value: 'all', label: 'All Priority' },
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-dark-800 dark:text-white">
                        My Tasks
                    </h1>
                    <p className="text-dark-500 dark:text-dark-400 mt-1">
                        Tasks assigned to you across all projects
                    </p>
                </div>
                <Button onClick={handleCreate} leftIcon={<Plus className="w-5 h-5" />}>
                    New Task
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="w-5 h-5" />}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-600 rounded-xl text-dark-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-4 py-3 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-600 rounded-xl text-dark-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {priorityOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
                <div className="bg-white dark:bg-dark-800 rounded-2xl p-12 text-center border border-dark-100 dark:border-dark-700">
                    <div className="w-16 h-16 bg-dark-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-dark-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-2">
                        {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                            ? 'No tasks found'
                            : 'No tasks assigned to you'}
                    </h3>
                    <p className="text-dark-500 mb-4">
                        {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Tasks assigned to you will appear here'}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedTasks).map(([status, statusTasks]) => {
                        if (statusTasks.length === 0) return null;
                        const config = TASK_STATUS_CONFIG[status as TaskStatus];

                        return (
                            <div key={status}>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`w-3 h-3 rounded-full ${config.color}`} />
                                    <h2 className="font-semibold text-dark-800 dark:text-white">
                                        {config.label}
                                    </h2>
                                    <span className="px-2 py-0.5 bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300 text-xs font-medium rounded-full">
                                        {statusTasks.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {statusTasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onClick={() => handleEdit(task)}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Task Form Modal */}
            {showForm && (
                <TaskForm
                    isOpen={showForm}
                    onClose={() => {
                        setShowForm(false);
                        setSelectedTask(undefined);
                    }}
                    task={selectedTask}
                />
            )}
        </div>
    );
};
