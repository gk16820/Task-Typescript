import React, { useState } from 'react';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { useData } from '../context';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectForm } from '../components/projects/ProjectForm';
import { Button, Input } from '../components/common';
import { Project } from '../types';

export const Projects: React.FC = () => {
    const { projects } = useData();
    const [showForm, setShowForm] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleEdit = (project: Project) => {
        setSelectedProject(project);
        setShowForm(true);
    };

    const handleCreate = () => {
        setSelectedProject(undefined);
        setShowForm(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-dark-800 dark:text-white">
                        Projects
                    </h1>
                    <p className="text-dark-500 dark:text-dark-400 mt-1">
                        Manage and track all your projects
                    </p>
                </div>
                <Button onClick={handleCreate} leftIcon={<Plus className="w-5 h-5" />}>
                    New Project
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search projects..."
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
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                    <div className="flex bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-600 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-3 ${viewMode === 'grid' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-500' : 'text-dark-400'}`}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-3 ${viewMode === 'list' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-500' : 'text-dark-400'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Projects Grid/List */}
            {filteredProjects.length === 0 ? (
                <div className="bg-white dark:bg-dark-800 rounded-2xl p-12 text-center border border-dark-100 dark:border-dark-700">
                    <div className="w-16 h-16 bg-dark-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-dark-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-2">
                        {searchQuery || statusFilter !== 'all' ? 'No projects found' : 'No projects yet'}
                    </h3>
                    <p className="text-dark-500 mb-4">
                        {searchQuery || statusFilter !== 'all'
                            ? 'Try adjusting your search or filter'
                            : 'Create your first project to get started'}
                    </p>
                    {!searchQuery && statusFilter === 'all' && (
                        <Button onClick={handleCreate}>Create Project</Button>
                    )}
                </div>
            ) : (
                <div
                    className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                            : 'space-y-4'
                    }
                >
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}

            {/* Project Form Modal */}
            {showForm && (
                <ProjectForm
                    isOpen={showForm}
                    onClose={() => {
                        setShowForm(false);
                        setSelectedProject(undefined);
                    }}
                    project={selectedProject}
                />
            )}
        </div>
    );
};
