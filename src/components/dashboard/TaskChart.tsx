import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';
import { Card } from '../common';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

interface TaskChartProps {
    data: {
        todo: number;
        inProgress: number;
        review: number;
        done: number;
    };
}

export const TaskChart: React.FC<TaskChartProps> = ({ data }) => {
    const chartData = {
        labels: ['To Do', 'In Progress', 'In Review', 'Done'],
        datasets: [
            {
                data: [data.todo, data.inProgress, data.review, data.done],
                backgroundColor: [
                    'rgba(100, 116, 139, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                ],
                borderColor: [
                    'rgb(100, 116, 139)',
                    'rgb(59, 130, 246)',
                    'rgb(168, 85, 247)',
                    'rgb(34, 197, 94)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
        },
        cutout: '65%',
    };

    return (
        <Card>
            <div className="p-5">
                <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-4">
                    Task Distribution
                </h3>
                <div className="h-64">
                    <Doughnut data={chartData} options={options} />
                </div>
            </div>
        </Card>
    );
};

interface WeeklyProgressProps {
    data: number[];
}

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ data }) => {
    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Tasks Completed',
                data: data,
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderColor: 'rgb(99, 102, 241)',
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <Card>
            <div className="p-5">
                <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-4">
                    Weekly Progress
                </h3>
                <div className="h-64">
                    <Bar data={chartData} options={options} />
                </div>
            </div>
        </Card>
    );
};
