import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FolderKanban, MoreVertical } from 'lucide-react';
import { Team } from '../../types';
import { Card, AvatarGroup } from '../common';
import { useData } from '../../context';

interface TeamCardProps {
    team: Team;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
    team,
    onEdit,
    onDelete,
}) => {
    const { users, projects } = useData();

    const teamMembers = [team.ownerId, ...team.memberIds]
        .map((id) => users.find((u) => u.id === id))
        .filter(Boolean)
        .map((u) => ({ name: u!.name }));

    const teamProjects = projects.filter((p) => p.teamId === team.id);

    return (
        <Card hover className="group">
            <Link to={`/teams/${team.id}`}>
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: team.color + '20' }}
                        >
                            <Users className="w-6 h-6" style={{ color: team.color }} />
                        </div>
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

                    {/* Title & Description */}
                    <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-2">
                        {team.name}
                    </h3>
                    <p className="text-sm text-dark-500 dark:text-dark-400 line-clamp-2 mb-4">
                        {team.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-dark-500 mb-4">
                        <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span>{teamMembers.length} members</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <FolderKanban className="w-4 h-4" />
                            <span>{teamProjects.length} projects</span>
                        </div>
                    </div>

                    {/* Members */}
                    <div className="pt-4 border-t border-dark-100 dark:border-dark-700">
                        <AvatarGroup users={teamMembers} max={5} size="sm" />
                    </div>
                </div>
            </Link>
        </Card>
    );
};
