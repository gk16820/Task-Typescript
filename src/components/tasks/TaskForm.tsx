import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select } from '../common';
import { Task, TaskFormData, TaskStatus, TaskPriority } from '../../types';
import { useData } from '../../context';

interface TaskFormProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task;
    defaultProjectId?: string;
    defaultStatus?: TaskStatus;
}

export const TaskForm: React.FC<TaskFormProps> = ({
    isOpen,
    onClose,
    task,
    defaultProjectId,
    defaultStatus = 'todo',
}) => {
    const { createTask, updateTask, projects, users } = useData();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [formData, setFormData] = useState<TaskFormData>({
        title: '',
        description: '',
        projectId: defaultProjectId || '',
        assigneeId: '',
        status: defaultStatus,
        priority: 'medium',
        dueDate: '',
        tags: [],
    });
    const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                projectId: task.projectId,
                assigneeId: task.assigneeId || '',
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate || '',
                tags: task.tags,
            });
        } else {
            setFormData({
                title: '',
                description: '',
                projectId: defaultProjectId || '',
                assigneeId: '',
                status: defaultStatus,
                priority: 'medium',
                dueDate: '',
                tags: [],
            });
        }
        setErrors({});
        setTagInput('');
    }, [task, isOpen, defaultProjectId, defaultStatus]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Task title is required';
        }
        if (!formData.projectId) {
            newErrors.projectId = 'Please select a project';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            if (task) {
                updateTask(task.id, formData);
            } else {
                createTask(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving task:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !formData.tags.includes(tag)) {
            setFormData({ ...formData, tags: [...formData.tags, tag] });
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((t) => t !== tagToRemove),
        });
    };

    const statusOptions = [
        { value: 'todo', label: 'To Do' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'review', label: 'In Review' },
        { value: 'done', label: 'Done' },
    ];

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' },
    ];

    const projectOptions = projects.map((p) => ({ value: p.id, label: p.name }));
    const userOptions = [
        { value: '', label: 'Unassigned' },
        ...users.map((u) => ({ value: u.id, label: u.name })),
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={task ? 'Edit Task' : 'Create New Task'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Task Title"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    error={errors.title}
                />

                <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">
                        Description
                    </label>
                    <textarea
                        placeholder="Describe your task..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-600 rounded-xl text-dark-800 dark:text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Project"
                        options={projectOptions}
                        value={formData.projectId}
                        onChange={(value) => setFormData({ ...formData, projectId: value })}
                        placeholder="Select project"
                        error={errors.projectId}
                    />

                    <Select
                        label="Assignee"
                        options={userOptions}
                        value={formData.assigneeId}
                        onChange={(value) => setFormData({ ...formData, assigneeId: value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Status"
                        options={statusOptions}
                        value={formData.status}
                        onChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}
                    />

                    <Select
                        label="Priority"
                        options={priorityOptions}
                        value={formData.priority}
                        onChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}
                    />
                </div>

                <Input
                    type="date"
                    label="Due Date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">
                        Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                        <Input
                            placeholder="Add a tag"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" variant="secondary" onClick={addTag}>
                            Add
                        </Button>
                    </div>
                    {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-primary-900 dark:hover:text-primary-100"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-dark-100 dark:border-dark-700">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {task ? 'Update Task' : 'Create Task'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
