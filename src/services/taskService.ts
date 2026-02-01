import { Task, TaskFormData, TaskStatus, TaskPriority } from '../types';
import { storage } from './storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId, isOverdue } from '../utils/helpers';

export const taskService = {
    // Get all tasks
    getAll: (): Task[] => {
        return storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
    },

    // Get tasks by project
    getByProject: (projectId: string): Task[] => {
        const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
        return tasks.filter((t) => t.projectId === projectId);
    },

    // Get tasks by assignee
    getByAssignee: (assigneeId: string): Task[] => {
        const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
        return tasks.filter((t) => t.assigneeId === assigneeId);
    },

    // Get task by ID
    getById: (taskId: string): Task | null => {
        const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
        return tasks.find((t) => t.id === taskId) || null;
    },

    // Create new task
    create: (data: TaskFormData): Task => {
        const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];

        const newTask: Task = {
            id: generateId(),
            title: data.title,
            description: data.description,
            projectId: data.projectId,
            assigneeId: data.assigneeId,
            status: data.status,
            priority: data.priority,
            dueDate: data.dueDate,
            tags: data.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        tasks.push(newTask);
        storage.set(STORAGE_KEYS.TASKS, tasks);

        return newTask;
    },

    // Update task
    update: (taskId: string, updates: Partial<TaskFormData>): Task | null => {
        const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
        const taskIndex = tasks.findIndex((t) => t.id === taskId);

        if (taskIndex === -1) {
            throw new Error('Task not found');
        }

        const updatedTask = {
            ...tasks[taskIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        tasks[taskIndex] = updatedTask;
        storage.set(STORAGE_KEYS.TASKS, tasks);

        return updatedTask;
    },

    // Delete task
    delete: (taskId: string): void => {
        const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
        const filteredTasks = tasks.filter((t) => t.id !== taskId);
        storage.set(STORAGE_KEYS.TASKS, filteredTasks);
    },

    // Update task status
    updateStatus: (taskId: string, status: TaskStatus): Task | null => {
        return taskService.update(taskId, { status });
    },

    // Update task priority
    updatePriority: (taskId: string, priority: TaskPriority): Task | null => {
        return taskService.update(taskId, { priority });
    },

    // Assign task to user
    assignTask: (taskId: string, assigneeId: string | undefined): Task | null => {
        return taskService.update(taskId, { assigneeId });
    },

    // Get tasks by status
    getByStatus: (projectId: string, status: TaskStatus): Task[] => {
        const tasks = taskService.getByProject(projectId);
        return tasks.filter((t) => t.status === status);
    },

    // Get overdue tasks
    getOverdueTasks: (projectIds?: string[]): Task[] => {
        const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
        return tasks.filter((t) => {
            const matchesProject = !projectIds || projectIds.includes(t.projectId);
            return matchesProject && t.status !== 'done' && isOverdue(t.dueDate);
        });
    },

    // Get task statistics
    getStats: (projectIds?: string[]): {
        total: number;
        todo: number;
        inProgress: number;
        review: number;
        done: number;
        overdue: number;
    } => {
        const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
        const filteredTasks = projectIds
            ? tasks.filter((t) => projectIds.includes(t.projectId))
            : tasks;

        return {
            total: filteredTasks.length,
            todo: filteredTasks.filter((t) => t.status === 'todo').length,
            inProgress: filteredTasks.filter((t) => t.status === 'in-progress').length,
            review: filteredTasks.filter((t) => t.status === 'review').length,
            done: filteredTasks.filter((t) => t.status === 'done').length,
            overdue: filteredTasks.filter((t) => t.status !== 'done' && isOverdue(t.dueDate)).length,
        };
    },

    // Get tasks grouped by status
    getGroupedByStatus: (projectId: string): Record<TaskStatus, Task[]> => {
        const tasks = taskService.getByProject(projectId);
        return {
            'todo': tasks.filter((t) => t.status === 'todo'),
            'in-progress': tasks.filter((t) => t.status === 'in-progress'),
            'review': tasks.filter((t) => t.status === 'review'),
            'done': tasks.filter((t) => t.status === 'done'),
        };
    },

    // Search tasks
    search: (query: string, projectIds?: string[]): Task[] => {
        const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
        const lowerQuery = query.toLowerCase();

        return tasks.filter((t) => {
            const matchesProject = !projectIds || projectIds.includes(t.projectId);
            const matchesQuery =
                t.title.toLowerCase().includes(lowerQuery) ||
                t.description.toLowerCase().includes(lowerQuery) ||
                t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
            return matchesProject && matchesQuery;
        });
    },

    // Delete all tasks for a project
    deleteByProject: (projectId: string): void => {
        const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
        const filteredTasks = tasks.filter((t) => t.projectId !== projectId);
        storage.set(STORAGE_KEYS.TASKS, filteredTasks);
    },
};
