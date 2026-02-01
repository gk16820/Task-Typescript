import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from '../common';
import { Team, TeamFormData } from '../../types';
import { useData } from '../../context';
import { TEAM_COLORS } from '../../utils/constants';

interface TeamFormProps {
    isOpen: boolean;
    onClose: () => void;
    team?: Team;
}

export const TeamForm: React.FC<TeamFormProps> = ({
    isOpen,
    onClose,
    team,
}) => {
    const { createTeam, updateTeam } = useData();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<TeamFormData>({
        name: '',
        description: '',
        color: TEAM_COLORS[0],
        memberIds: [],
    });
    const [errors, setErrors] = useState<Partial<Record<keyof TeamFormData, string>>>({});

    useEffect(() => {
        if (team) {
            setFormData({
                name: team.name,
                description: team.description,
                color: team.color,
                memberIds: team.memberIds,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                color: TEAM_COLORS[Math.floor(Math.random() * TEAM_COLORS.length)],
                memberIds: [],
            });
        }
        setErrors({});
    }, [team, isOpen]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof TeamFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Team name is required';
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
            if (team) {
                updateTeam(team.id, formData);
            } else {
                createTeam(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving team:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={team ? 'Edit Team' : 'Create New Team'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Team Name"
                    placeholder="Enter team name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                />

                <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-1.5">
                        Description
                    </label>
                    <textarea
                        placeholder="Describe your team..."
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

                {/* Color Picker */}
                <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-2">
                        Team Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {TEAM_COLORS.map((color) => (
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
                        {team ? 'Update Team' : 'Create Team'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
