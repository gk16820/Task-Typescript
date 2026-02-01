import { Team, TeamFormData } from '../types';
import { storage } from './storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId } from '../utils/helpers';

export const teamService = {
    // Get all teams
    getAll: (): Team[] => {
        return storage.get<Team[]>(STORAGE_KEYS.TEAMS) || [];
    },

    // Get teams by owner
    getByOwner: (ownerId: string): Team[] => {
        const teams = storage.get<Team[]>(STORAGE_KEYS.TEAMS) || [];
        return teams.filter((t) => t.ownerId === ownerId);
    },

    // Get teams where user is a member
    getByMember: (userId: string): Team[] => {
        const teams = storage.get<Team[]>(STORAGE_KEYS.TEAMS) || [];
        return teams.filter((t) => t.ownerId === userId || t.memberIds.includes(userId));
    },

    // Get team by ID
    getById: (teamId: string): Team | null => {
        const teams = storage.get<Team[]>(STORAGE_KEYS.TEAMS) || [];
        return teams.find((t) => t.id === teamId) || null;
    },

    // Create new team
    create: (ownerId: string, data: TeamFormData): Team => {
        const teams = storage.get<Team[]>(STORAGE_KEYS.TEAMS) || [];

        const newTeam: Team = {
            id: generateId(),
            name: data.name,
            description: data.description,
            ownerId,
            memberIds: data.memberIds || [],
            color: data.color,
            createdAt: new Date().toISOString(),
        };

        teams.push(newTeam);
        storage.set(STORAGE_KEYS.TEAMS, teams);

        return newTeam;
    },

    // Update team
    update: (teamId: string, updates: Partial<TeamFormData>): Team | null => {
        const teams = storage.get<Team[]>(STORAGE_KEYS.TEAMS) || [];
        const teamIndex = teams.findIndex((t) => t.id === teamId);

        if (teamIndex === -1) {
            throw new Error('Team not found');
        }

        const updatedTeam = {
            ...teams[teamIndex],
            ...updates,
        };

        teams[teamIndex] = updatedTeam;
        storage.set(STORAGE_KEYS.TEAMS, teams);

        return updatedTeam;
    },

    // Delete team
    delete: (teamId: string): void => {
        const teams = storage.get<Team[]>(STORAGE_KEYS.TEAMS) || [];
        const filteredTeams = teams.filter((t) => t.id !== teamId);
        storage.set(STORAGE_KEYS.TEAMS, filteredTeams);
    },

    // Add member to team
    addMember: (teamId: string, userId: string): Team | null => {
        const teams = storage.get<Team[]>(STORAGE_KEYS.TEAMS) || [];
        const teamIndex = teams.findIndex((t) => t.id === teamId);

        if (teamIndex === -1) {
            throw new Error('Team not found');
        }

        const team = teams[teamIndex];
        if (!team.memberIds.includes(userId)) {
            team.memberIds.push(userId);
            teams[teamIndex] = team;
            storage.set(STORAGE_KEYS.TEAMS, teams);
        }

        return team;
    },

    // Remove member from team
    removeMember: (teamId: string, userId: string): Team | null => {
        const teams = storage.get<Team[]>(STORAGE_KEYS.TEAMS) || [];
        const teamIndex = teams.findIndex((t) => t.id === teamId);

        if (teamIndex === -1) {
            throw new Error('Team not found');
        }

        const team = teams[teamIndex];
        team.memberIds = team.memberIds.filter((id) => id !== userId);
        teams[teamIndex] = team;
        storage.set(STORAGE_KEYS.TEAMS, teams);

        return team;
    },

    // Get team member count
    getMemberCount: (teamId: string): number => {
        const team = teamService.getById(teamId);
        if (!team) return 0;
        return team.memberIds.length + 1; // +1 for owner
    },

    // Check if user is team member
    isMember: (teamId: string, userId: string): boolean => {
        const team = teamService.getById(teamId);
        if (!team) return false;
        return team.ownerId === userId || team.memberIds.includes(userId);
    },

    // Get all member IDs (including owner)
    getAllMemberIds: (teamId: string): string[] => {
        const team = teamService.getById(teamId);
        if (!team) return [];
        return [team.ownerId, ...team.memberIds];
    },
};
