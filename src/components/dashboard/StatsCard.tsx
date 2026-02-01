import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../common';

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    color,
}) => {
    return (
        <Card className="relative overflow-hidden">
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-dark-500 dark:text-dark-400 mb-1">
                            {title}
                        </p>
                        <p className="text-3xl font-bold text-dark-800 dark:text-white">
                            {value}
                        </p>
                        {trend && (
                            <p
                                className={`text-sm mt-2 font-medium ${trend.isPositive ? 'text-accent-500' : 'text-red-500'
                                    }`}
                            >
                                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                                <span className="text-dark-400 font-normal ml-1">vs last week</span>
                            </p>
                        )}
                    </div>
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: color + '20' }}
                    >
                        <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                </div>
            </div>

            {/* Decorative gradient */}
            <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
            />
        </Card>
    );
};
