import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Users, Calendar } from 'lucide-react';
import { useData } from '../context';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { ProjectForm } from '../components/projects/ProjectForm';
import { Button, Card, Avatar, AvatarGroup, Badge } from '../components/common';
import { formatDate, calculateCompletionPercentage } from '../utils/helpers';

export const ProjectDetail: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { getProject, getTasksByProject, getTeam, users, deleteProject } = useData();
    const [showEditForm, setShowEditForm] = useState(false);

    const project = projectId ? getProject(projectId) : null;
    const tasks = projectId ? getTasksByProject(projectId) : [];
    const team = project?.teamId ? getTeam(project.teamId) : null;

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-2">
                    Project not found
                </h2>
                <p className="text-dark-500 mb-4">
                    The project you're looking for doesn't exist
                </p>
                <Link to="/projects">
                    <Button variant="secondary">Back to Projects</Button>
                </Link>
            </div>
        );
    }

    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const completionPercentage = calculateCompletionPercentage(completedTasks, tasks.length);

    const teamMembers = team
        ? [team.ownerId, ...team.memberIds]
            .map((id) => users.find((u) => u.id === id))
            .filter(Boolean)
        : [];

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this project? All tasks will be deleted.')) {
            deleteProject(project.id);
            navigate('/projects');
        }
    };

    const getStatusBadge = () => {
        switch (project.status) {
            case 'active':
                return <Badge variant="success">Active</Badge>;
            case 'completed':
                return <Badge variant="primary">Completed</Badge>;
            case 'archived':
                return <Badge variant="default">Archived</Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Back Button */}
            <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-dark-500 hover:text-dark-700 dark:hover:text-dark-300 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
            </Link>

            {/* Project Header */}
            <Card className="!p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: project.color + '20' }}
                        >
                            <div
                                className="w-8 h-8 rounded-xl"
                                style={{ backgroundColor: project.color }}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-dark-800 dark:text-white">
                                    {project.name}
                                </h1>
                                {getStatusBadge()}
                            </div>
                            <p className="text-dark-500 dark:text-dark-400 mb-3">
                                {project.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-dark-500">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    <span>Created {formatDate(project.createdAt)}</span>
                                </div>
                                {team && (
                                    <div className="flex items-center gap-1.5">
                                        <Users className="w-4 h-4" />
                                        <span>{team.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<Edit2 className="w-4 h-4" />}
                            onClick={() => setShowEditForm(true)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            leftIcon={<Trash2 className="w-4 h-4" />}
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Progress & Team */}
                <div className="mt-6 pt-6 border-t border-dark-100 dark:border-dark-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Progress */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-dark-700 dark:text-dark-300">
                                    Progress
                                </span>
                                <span className="text-sm font-semibold text-dark-800 dark:text-white">
                                    {completedTasks}/{tasks.length} tasks ({completionPercentage}%)
                                </span>
                            </div>
                            <div className="h-3 bg-dark-100 dark:bg-dark-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${completionPercentage}%`,
                                        backgroundColor: project.color,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Team Members */}
                        {teamMembers.length > 0 && (
                            <div>
                                <span className="text-sm font-medium text-dark-700 dark:text-dark-300 mb-2 block">
                                    Team Members
                                </span>
                                <div className="flex items-center gap-3">
                                    <AvatarGroup
                                        users={teamMembers.map((u) => ({ name: u!.name }))}
                                        max={5}
                                        size="md"
                                    />
                                    <span className="text-sm text-dark-500">
                                        {teamMembers.length} members
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Kanban Board */}
            <div>
                <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-4">
                    Task Board
                </h2>
                <KanbanBoard projectId={project.id} />
            </div>

            {/* Edit Form Modal */}
            {showEditForm && (
                <ProjectForm
                    isOpen={showEditForm}
                    onClose={() => setShowEditForm(false)}
                    project={project}
                />
            )}
        </div>
    );
};
