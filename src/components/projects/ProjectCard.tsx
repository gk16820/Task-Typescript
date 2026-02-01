import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Users, CheckCircle, Clock } from 'lucide-react';
import { Project, Task } from '../../types';
import { Card, AvatarGroup, Badge } from '../common';
import { useData } from '../../context';
import { calculateCompletionPercentage } from '../../utils/helpers';

interface ProjectCardProps {
    project: Project;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    onEdit,
    onDelete,
}) => {
    const { getTasksByProject, getTeam, users } = useData();
    const tasks = getTasksByProject(project.id);
    const team = project.teamId ? getTeam(project.teamId) : null;

    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const completionPercentage = calculateCompletionPercentage(completedTasks, tasks.length);

    const teamMembers = team
        ? [team.ownerId, ...team.memberIds]
            .map((id) => users.find((u) => u.id === id))
            .filter(Boolean)
            .map((u) => ({ name: u!.name }))
        : [];

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
        <Card hover className="group">
            <Link to={`/projects/${project.id}`}>
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: project.color + '20' }}
                        >
                            <div
                                className="w-6 h-6 rounded-lg"
                                style={{ backgroundColor: project.color }}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusBadge()}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-all"
                            >
                                <MoreVertical className="w-4 h-4 text-dark-400" />
                            </button>
                        </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-2">
                        {project.name}
                    </h3>
                    <p className="text-sm text-dark-500 dark:text-dark-400 line-clamp-2 mb-4">
                        {project.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-dark-600 dark:text-dark-300">Progress</span>
                            <span className="font-medium text-dark-800 dark:text-white">
                                {completionPercentage}%
                            </span>
                        </div>
                        <div className="h-2 bg-dark-100 dark:bg-dark-700 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${completionPercentage}%`,
                                    backgroundColor: project.color,
                                }}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-dark-100 dark:border-dark-700">
                        <div className="flex items-center gap-4 text-sm text-dark-500">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4" />
                                <span>{completedTasks}/{tasks.length}</span>
                            </div>
                            {team && (
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4" />
                                    <span>{teamMembers.length}</span>
                                </div>
                            )}
                        </div>
                        {teamMembers.length > 0 && (
                            <AvatarGroup users={teamMembers} max={3} size="xs" />
                        )}
                    </div>
                </div>
            </Link>
        </Card>
    );
};
