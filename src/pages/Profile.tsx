import React, { useState } from 'react';
import { User, Mail, Calendar, Save } from 'lucide-react';
import { useAuth } from '../context';
import { Button, Input, Card, Avatar } from '../components/common';
import { formatDate } from '../utils/helpers';

export const Profile: React.FC = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    if (!user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateProfile({ name: formData.name });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-dark-800 dark:text-white">
                    Profile Settings
                </h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">
                    Manage your account settings
                </p>
            </div>

            {/* Profile Card */}
            <Card className="!p-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center">
                        <Avatar name={user.name} size="xl" />
                        <p className="mt-2 text-sm text-dark-500">Profile Picture</p>
                    </div>

                    {/* Info */}
                    <div className="flex-1 w-full">
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    leftIcon={<User className="w-5 h-5" />}
                                />

                                <Input
                                    label="Email Address"
                                    value={formData.email}
                                    disabled
                                    leftIcon={<Mail className="w-5 h-5" />}
                                    helperText="Email cannot be changed"
                                />

                                <div className="flex gap-3 pt-2">
                                    <Button type="submit" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
                                        Save Changes
                                    </Button>
                                    <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-500 mb-1">
                                        Full Name
                                    </label>
                                    <div className="flex items-center gap-2 text-dark-800 dark:text-white">
                                        <User className="w-5 h-5 text-dark-400" />
                                        <span className="text-lg">{user.name}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark-500 mb-1">
                                        Email Address
                                    </label>
                                    <div className="flex items-center gap-2 text-dark-800 dark:text-white">
                                        <Mail className="w-5 h-5 text-dark-400" />
                                        <span className="text-lg">{user.email}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark-500 mb-1">
                                        Member Since
                                    </label>
                                    <div className="flex items-center gap-2 text-dark-800 dark:text-white">
                                        <Calendar className="w-5 h-5 text-dark-400" />
                                        <span className="text-lg">{formatDate(user.createdAt)}</span>
                                    </div>
                                </div>

                                <Button onClick={() => setIsEditing(true)} className="mt-4">
                                    Edit Profile
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

        </div>
    );
};
