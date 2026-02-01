import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Project, Task, Team, User, ProjectFormData, TaskFormData, TeamFormData, TaskStatus } from '../types';
import { projectService, taskService, teamService, authService, initializeStorage } from '../services';
import { useAuth } from './AuthContext';

interface DataContextType {
    // Projects
    projects: Project[];
    loadProjects: () => void;
    createProject: (data: ProjectFormData) => Project;
    updateProject: (projectId: string, data: Partial<ProjectFormData>) => Project | null;
    deleteProject: (projectId: string) => void;
    getProject: (projectId: string) => Project | null;

    // Tasks
    tasks: Task[];
    loadTasks: () => void;
    createTask: (data: TaskFormData) => Task;
    updateTask: (taskId: string, data: Partial<TaskFormData>) => Task | null;
    deleteTask: (taskId: string) => void;
    updateTaskStatus: (taskId: string, status: TaskStatus) => Task | null;
    getTasksByProject: (projectId: string) => Task[];
    getTask: (taskId: string) => Task | null;

    // Teams
    teams: Team[];
    loadTeams: () => void;
    createTeam: (data: TeamFormData) => Team;
    updateTeam: (teamId: string, data: Partial<TeamFormData>) => Team | null;
    deleteTeam: (teamId: string) => void;
    addTeamMember: (teamId: string, userId: string) => Team | null;
    removeTeamMember: (teamId: string, userId: string) => Team | null;
    getTeam: (teamId: string) => Team | null;

    // Users
    users: User[];
    loadUsers: () => void;
    getUser: (userId: string) => User | null;

    // Refresh all data
    refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    // Initialize storage on mount
    useEffect(() => {
        initializeStorage();
    }, []);

    // Load data when user changes
    useEffect(() => {
        if (isAuthenticated && user) {
            loadProjects();
            loadTasks();
            loadTeams();
            loadUsers();
        } else {
            setProjects([]);
            setTasks([]);
            setTeams([]);
        }
    }, [isAuthenticated, user]);

    // Projects
    const loadProjects = useCallback(() => {
        if (!user) return;
        const userTeams = teamService.getByMember(user.id);
        const teamIds = userTeams.map((t) => t.id);
        const accessibleProjects = projectService.getAccessibleProjects(user.id, teamIds);
        setProjects(accessibleProjects);
    }, [user]);

    const createProject = useCallback((data: ProjectFormData): Project => {
        if (!user) throw new Error('User not authenticated');
        const newProject = projectService.create(user.id, data);
        setProjects((prev) => [...prev, newProject]);
        return newProject;
    }, [user]);

    const updateProject = useCallback((projectId: string, data: Partial<ProjectFormData>): Project | null => {
        const updated = projectService.update(projectId, data);
        if (updated) {
            setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));
        }
        return updated;
    }, []);

    const deleteProject = useCallback((projectId: string): void => {
        projectService.delete(projectId);
        taskService.deleteByProject(projectId);
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        setTasks((prev) => prev.filter((t) => t.projectId !== projectId));
    }, []);

    const getProject = useCallback((projectId: string): Project | null => {
        return projects.find((p) => p.id === projectId) || null;
    }, [projects]);

    // Tasks
    const loadTasks = useCallback(() => {
        const allTasks = taskService.getAll();
        setTasks(allTasks);
    }, []);

    const createTask = useCallback((data: TaskFormData): Task => {
        const newTask = taskService.create(data);
        setTasks((prev) => [...prev, newTask]);
        return newTask;
    }, []);

    const updateTask = useCallback((taskId: string, data: Partial<TaskFormData>): Task | null => {
        const updated = taskService.update(taskId, data);
        if (updated) {
            setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        }
        return updated;
    }, []);

    const deleteTask = useCallback((taskId: string): void => {
        taskService.delete(taskId);
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }, []);

    const updateTaskStatus = useCallback((taskId: string, status: TaskStatus): Task | null => {
        const updated = taskService.updateStatus(taskId, status);
        if (updated) {
            setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        }
        return updated;
    }, []);

    const getTasksByProject = useCallback((projectId: string): Task[] => {
        return tasks.filter((t) => t.projectId === projectId);
    }, [tasks]);

    const getTask = useCallback((taskId: string): Task | null => {
        return tasks.find((t) => t.id === taskId) || null;
    }, [tasks]);

    // Teams
    const loadTeams = useCallback(() => {
        if (!user) return;
        const userTeams = teamService.getByMember(user.id);
        setTeams(userTeams);
    }, [user]);

    const createTeam = useCallback((data: TeamFormData): Team => {
        if (!user) throw new Error('User not authenticated');
        const newTeam = teamService.create(user.id, data);
        setTeams((prev) => [...prev, newTeam]);
        return newTeam;
    }, [user]);

    const updateTeam = useCallback((teamId: string, data: Partial<TeamFormData>): Team | null => {
        const updated = teamService.update(teamId, data);
        if (updated) {
            setTeams((prev) => prev.map((t) => (t.id === teamId ? updated : t)));
        }
        return updated;
    }, []);

    const deleteTeam = useCallback((teamId: string): void => {
        teamService.delete(teamId);
        setTeams((prev) => prev.filter((t) => t.id !== teamId));
    }, []);

    const addTeamMember = useCallback((teamId: string, userId: string): Team | null => {
        const updated = teamService.addMember(teamId, userId);
        if (updated) {
            setTeams((prev) => prev.map((t) => (t.id === teamId ? updated : t)));
        }
        return updated;
    }, []);

    const removeTeamMember = useCallback((teamId: string, userId: string): Team | null => {
        const updated = teamService.removeMember(teamId, userId);
        if (updated) {
            setTeams((prev) => prev.map((t) => (t.id === teamId ? updated : t)));
        }
        return updated;
    }, []);

    const getTeam = useCallback((teamId: string): Team | null => {
        return teams.find((t) => t.id === teamId) || null;
    }, [teams]);

    // Users
    const loadUsers = useCallback(() => {
        const allUsers = authService.getAllUsers();
        setUsers(allUsers);
    }, []);

    const getUser = useCallback((userId: string): User | null => {
        return users.find((u) => u.id === userId) || null;
    }, [users]);

    // Refresh all data
    const refreshData = useCallback(() => {
        loadProjects();
        loadTasks();
        loadTeams();
        loadUsers();
    }, [loadProjects, loadTasks, loadTeams, loadUsers]);

    return (
        <DataContext.Provider
            value={{
                projects,
                loadProjects,
                createProject,
                updateProject,
                deleteProject,
                getProject,
                tasks,
                loadTasks,
                createTask,
                updateTask,
                deleteTask,
                updateTaskStatus,
                getTasksByProject,
                getTask,
                teams,
                loadTeams,
                createTeam,
                updateTeam,
                deleteTeam,
                addTeamMember,
                removeTeamMember,
                getTeam,
                users,
                loadUsers,
                getUser,
                refreshData,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
