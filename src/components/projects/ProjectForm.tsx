import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select } from '../common';
import { Project, ProjectFormData, ProjectStatus } from '../../types';
import { useData } from '../../context';
import { PROJECT_COLORS } from '../../utils/constants';

interface ProjectFormProps {
    isOpen: boolean;
    onClose: () => void;
    project?: Project;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
    isOpen,
    onClose,
    project,
}) => {
    const { createProject, updateProject, teams } = useData();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<ProjectFormData>({
        name: '',
        description: '',
        teamId: '',
        status: 'active',
        color: PROJECT_COLORS[0],
    });
    const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name,
                description: project.description,
                teamId: project.teamId || '',
                status: project.status,
                color: project.color,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                teamId: '',
                status: 'active',
                color: PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)],
            });
        }
        setErrors({});
    }, [project, isOpen]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Project name is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            if (project) {
                updateProject(project.id, formData);
            } else {
                createProject(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving project:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'archived', label: 'Archived' },
    ];

    const teamOptions = [
        { value: '', label: 'No Team' },
        ...teams.map((t) => ({ value: t.id, label: t.name })),
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={project ? 'Edit Project' : 'Create New Project'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Project Name"
                    placeholder="Enter project name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                />

                <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">
                        Description
                    </label>
                    <textarea
                        placeholder="Describe your project..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className={`
              w-full px-4 py-3 bg-white dark:bg-dark-800 
              border rounded-xl text-dark-800 dark:text-white 
              placeholder-dark-400 dark:placeholder-dark-500
              focus:outline-none focus:ring-2 focus:border-transparent 
              transition-all duration-200 resize-none
              ${errors.description
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-dark-200 dark:border-dark-600 focus:ring-primary-500'
                            }
            `}
                    />
                    {errors.description && (
                        <p className="mt-1.5 text-sm text-red-500">{errors.description}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Status"
                        options={statusOptions}
                        value={formData.status}
                        onChange={(value) => setFormData({ ...formData, status: value as ProjectStatus })}
                    />

                    <Select
                        label="Team"
                        options={teamOptions}
                        value={formData.teamId}
                        onChange={(value) => setFormData({ ...formData, teamId: value })}
                    />
                </div>

                {/* Color Picker */}
                <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-2">
                        Project Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {PROJECT_COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setFormData({ ...formData, color })}
                                className={`
                  w-8 h-8 rounded-lg transition-transform hover:scale-110
                  ${formData.color === color ? 'ring-2 ring-offset-2 ring-primary-500' : ''}
                `}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-dark-100 dark:border-dark-700">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {project ? 'Update Project' : 'Create Project'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
