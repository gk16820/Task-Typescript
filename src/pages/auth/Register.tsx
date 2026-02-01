import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, CheckSquare } from 'lucide-react';
import { Button, Input } from '../../components/common';
import { useAuth } from '../../context';
import { isValidEmail } from '../../utils/helpers';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validate()) return;

        setIsLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-xl mb-4">
                        <CheckSquare className="w-8 h-8 text-primary-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">TaskFlow</h1>
                    <p className="text-white/80 mt-2">Start managing your projects today</p>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-dark-800 dark:text-white mb-2">
                        Create Account
                    </h2>
                    <p className="text-dark-500 mb-6">
                        Join TaskFlow and boost your productivity
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            leftIcon={<User className="w-5 h-5" />}
                            error={errors.name}
                        />

                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            leftIcon={<Mail className="w-5 h-5" />}
                            error={errors.email}
                        />

                        <Input
                            type="password"
                            label="Password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            leftIcon={<Lock className="w-5 h-5" />}
                            error={errors.password}
                        />

                        <Input
                            type="password"
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            leftIcon={<Lock className="w-5 h-5" />}
                            error={errors.confirmPassword}
                        />

                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-dark-500">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-primary-500 hover:text-primary-600 font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
