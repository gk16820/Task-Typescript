import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, UserPlus, UserMinus, FolderKanban } from 'lucide-react';
import { useData, useAuth } from '../context';
import { TeamForm } from '../components/teams/TeamForm';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Button, Card, Avatar } from '../components/common';
import { formatDate } from '../utils/helpers';

export const TeamDetail: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getTeam, users, projects, deleteTeam, removeTeamMember } = useData();
    const [showEditForm, setShowEditForm] = useState(false);

    const team = teamId ? getTeam(teamId) : null;

    if (!team) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-2">
                    Team not found
                </h2>
                <p className="text-dark-500 mb-4">
                    The team you're looking for doesn't exist
                </p>
                <Link to="/teams">
                    <Button variant="secondary">Back to Teams</Button>
                </Link>
            </div>
        );
    }

    const owner = users.find((u) => u.id === team.ownerId);
    const members = team.memberIds
        .map((id) => users.find((u) => u.id === id))
        .filter(Boolean);
    const teamProjects = projects.filter((p) => p.teamId === team.id);
    const isOwner = user?.id === team.ownerId;

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this team?')) {
            deleteTeam(team.id);
            navigate('/teams');
        }
    };

    const handleRemoveMember = (memberId: string) => {
        if (window.confirm('Are you sure you want to remove this member?')) {
            removeTeamMember(team.id, memberId);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Back Button */}
            <Link
                to="/teams"
                className="inline-flex items-center gap-2 text-dark-500 hover:text-dark-700 dark:hover:text-dark-300 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Teams
            </Link>

            {/* Team Header */}
            <Card className="!p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: team.color + '20' }}
                        >
                            <span className="text-2xl font-bold" style={{ color: team.color }}>
                                {team.name.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-dark-800 dark:text-white mb-2">
                                {team.name}
                            </h1>
                            <p className="text-dark-500 dark:text-dark-400 mb-3">
                                {team.description}
                            </p>
                            <p className="text-sm text-dark-400">
                                Created {formatDate(team.createdAt)}
                            </p>
                        </div>
                    </div>

                    {isOwner && (
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
                    )}
                </div>
            </Card>

            {/* Members */}
            <div>
                <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-4">
                    Team Members ({members.length + 1})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Owner */}
                    {owner && (
                        <Card className="!p-4">
                            <div className="flex items-center gap-3">
                                <Avatar name={owner.name} size="lg" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-dark-800 dark:text-white">
                                            {owner.name}
                                        </p>
                                        <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
                                            Owner
                                        </span>
                                    </div>
                                    <p className="text-sm text-dark-500">{owner.email}</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Members */}
                    {members.map((member) => (
                        <Card key={member!.id} className="!p-4">
                            <div className="flex items-center gap-3">
                                <Avatar name={member!.name} size="lg" />
                                <div className="flex-1">
                                    <p className="font-medium text-dark-800 dark:text-white">
                                        {member!.name}
                                    </p>
                                    <p className="text-sm text-dark-500">{member!.email}</p>
                                </div>
                                {isOwner && (
                                    <button
                                        onClick={() => handleRemoveMember(member!.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Remove member"
                                    >
                                        <UserMinus className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Team Projects */}
            <div>
                <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-4">
                    Team Projects ({teamProjects.length})
                </h2>
                {teamProjects.length === 0 ? (
                    <Card className="!p-8 text-center">
                        <FolderKanban className="w-12 h-12 text-dark-300 mx-auto mb-3" />
                        <p className="text-dark-500">No projects assigned to this team</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teamProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Form Modal */}
            {showEditForm && (
                <TeamForm
                    isOpen={showEditForm}
                    onClose={() => setShowEditForm(false)}
                    team={team}
                />
            )}
        </div>
    );
};
