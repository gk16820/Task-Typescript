import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, CheckSquare } from 'lucide-react';
import { Button, Input } from '../../components/common';
import { useAuth } from '../../context';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(formData);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed');
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
                    <p className="text-white/80 mt-2">Manage your projects with ease</p>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-dark-800 dark:text-white mb-2">
                        Welcome back
                    </h2>
                    <p className="text-dark-500 mb-6">
                        Sign in to continue to your dashboard
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            leftIcon={<Mail className="w-5 h-5" />}
                            required
                        />

                        <Input
                            type="password"
                            label="Password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            leftIcon={<Lock className="w-5 h-5" />}
                            required
                        />

                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-dark-500">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-primary-500 hover:text-primary-600 font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Demo credentials */}
                <div className="mt-6 text-center text-white/70 text-sm">
                    <p>Demo: Create an account to get started</p>
                </div>
            </div>
        </div>
    );
};
