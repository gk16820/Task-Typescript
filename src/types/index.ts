// User types
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: string;
}

// Project types
export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface Project {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    teamId?: string;
    status: ProjectStatus;
    color: string;
    createdAt: string;
    updatedAt: string;
}

// Task types
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
    id: string;
    title: string;
    description: string;
    projectId: string;
    assigneeId?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

// Team types
export interface Team {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    memberIds: string[];
    color: string;
    createdAt: string;
}

// Activity types
export type ActivityType = 'task_created' | 'task_updated' | 'task_completed' | 'project_created' | 'team_created' | 'member_added';

export interface Activity {
    id: string;
    type: ActivityType;
    userId: string;
    entityId: string;
    entityType: 'task' | 'project' | 'team';
    description: string;
    createdAt: string;
}

// Auth types
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

// Dashboard stats
export interface DashboardStats {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    totalProjects: number;
    activeProjects: number;
    totalTeams: number;
}

// Form types
export interface TaskFormData {
    title: string;
    description: string;
    projectId: string;
    assigneeId?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    tags: string[];
}

export interface ProjectFormData {
    name: string;
    description: string;
    teamId?: string;
    status: ProjectStatus;
    color: string;
}

export interface TeamFormData {
    name: string;
    description: string;
    color: string;
    memberIds: string[];
}
