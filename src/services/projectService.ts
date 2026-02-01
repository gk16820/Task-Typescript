import { Project, ProjectFormData, ProjectStatus } from '../types';
import { storage } from './storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId } from '../utils/helpers';

export const projectService = {
    // Get all projects
    getAll: (): Project[] => {
        return storage.get<Project[]>(STORAGE_KEYS.PROJECTS) || [];
    },

    // Get projects by owner
    getByOwner: (ownerId: string): Project[] => {
        const projects = storage.get<Project[]>(STORAGE_KEYS.PROJECTS) || [];
        return projects.filter((p) => p.ownerId === ownerId);
    },

    // Get projects by team
    getByTeam: (teamId: string): Project[] => {
        const projects = storage.get<Project[]>(STORAGE_KEYS.PROJECTS) || [];
        return projects.filter((p) => p.teamId === teamId);
    },

    // Get project by ID
    getById: (projectId: string): Project | null => {
        const projects = storage.get<Project[]>(STORAGE_KEYS.PROJECTS) || [];
        return projects.find((p) => p.id === projectId) || null;
    },

    // Create new project
    create: (ownerId: string, data: ProjectFormData): Project => {
        const projects = storage.get<Project[]>(STORAGE_KEYS.PROJECTS) || [];

        const newProject: Project = {
            id: generateId(),
            name: data.name,
            description: data.description,
            ownerId,
            teamId: data.teamId,
            status: data.status,
            color: data.color,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        projects.push(newProject);
        storage.set(STORAGE_KEYS.PROJECTS, projects);

        return newProject;
    },

    // Update project
    update: (projectId: string, updates: Partial<ProjectFormData>): Project | null => {
        const projects = storage.get<Project[]>(STORAGE_KEYS.PROJECTS) || [];
        const projectIndex = projects.findIndex((p) => p.id === projectId);

        if (projectIndex === -1) {
            throw new Error('Project not found');
        }

        const updatedProject = {
            ...projects[projectIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        projects[projectIndex] = updatedProject;
        storage.set(STORAGE_KEYS.PROJECTS, projects);

        return updatedProject;
    },

    // Delete project
    delete: (projectId: string): void => {
        const projects = storage.get<Project[]>(STORAGE_KEYS.PROJECTS) || [];
        const filteredProjects = projects.filter((p) => p.id !== projectId);
        storage.set(STORAGE_KEYS.PROJECTS, filteredProjects);
    },

    // Update project status
    updateStatus: (projectId: string, status: ProjectStatus): Project | null => {
        return projectService.update(projectId, { status });
    },

    // Get project count by status
    getCountByStatus: (ownerId: string): Record<ProjectStatus, number> => {
        const projects = projectService.getByOwner(ownerId);
        return {
            active: projects.filter((p) => p.status === 'active').length,
            completed: projects.filter((p) => p.status === 'completed').length,
            archived: projects.filter((p) => p.status === 'archived').length,
        };
    },

    // Get user's accessible projects (owned or team member)
    getAccessibleProjects: (userId: string, teamIds: string[]): Project[] => {
        const projects = storage.get<Project[]>(STORAGE_KEYS.PROJECTS) || [];
        return projects.filter(
            (p) => p.ownerId === userId || (p.teamId && teamIds.includes(p.teamId))
        );
    },
};
