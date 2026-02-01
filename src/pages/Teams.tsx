import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useData } from '../context';
import { TeamCard } from '../components/teams/TeamCard';
import { TeamForm } from '../components/teams/TeamForm';
import { Button, Input } from '../components/common';
import { Team } from '../types';

export const Teams: React.FC = () => {
    const { teams } = useData();
    const [showForm, setShowForm] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | undefined>();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTeams = teams.filter((team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (team: Team) => {
        setSelectedTeam(team);
        setShowForm(true);
    };

    const handleCreate = () => {
        setSelectedTeam(undefined);
        setShowForm(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-dark-800 dark:text-white">
                        Teams
                    </h1>
                    <p className="text-dark-500 dark:text-dark-400 mt-1">
                        Collaborate with your team members
                    </p>
                </div>
                <Button onClick={handleCreate} leftIcon={<Plus className="w-5 h-5" />}>
                    New Team
                </Button>
            </div>

            {/* Search */}
            <div className="max-w-md">
                <Input
                    placeholder="Search teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-5 h-5" />}
                />
            </div>

            {/* Teams Grid */}
            {filteredTeams.length === 0 ? (
                <div className="bg-white dark:bg-dark-800 rounded-2xl p-12 text-center border border-dark-100 dark:border-dark-700">
                    <div className="w-16 h-16 bg-dark-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-dark-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-2">
                        {searchQuery ? 'No teams found' : 'No teams yet'}
                    </h3>
                    <p className="text-dark-500 mb-4">
                        {searchQuery
                            ? 'Try adjusting your search'
                            : 'Create a team to start collaborating'}
                    </p>
                    {!searchQuery && (
                        <Button onClick={handleCreate}>Create Team</Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTeams.map((team) => (
                        <TeamCard key={team.id} team={team} />
                    ))}
                </div>
            )}

            {/* Team Form Modal */}
            {showForm && (
                <TeamForm
                    isOpen={showForm}
                    onClose={() => {
                        setShowForm(false);
                        setSelectedTeam(undefined);
                    }}
                    team={selectedTeam}
                />
            )}
        </div>
    );
};
