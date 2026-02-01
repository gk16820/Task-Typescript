import React from 'react';
import { Clock } from 'lucide-react';
import { Card, Avatar, StatusBadge } from '../common';
import { Task } from '../../types';
import { useData } from '../../context';
import { formatRelativeTime } from '../../utils/helpers';

interface ActivityFeedProps {
    tasks: Task[];
    limit?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
    tasks,
    limit = 5,
}) => {
    const { getUser, getProject } = useData();

    const recentTasks = [...tasks]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit);

    return (
        <Card>
            <div className="p-5">
                <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-4">
                    Recent Activity
                </h3>

                {recentTasks.length === 0 ? (
                    <div className="text-center py-8 text-dark-400">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No recent activity</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentTasks.map((task) => {
                            const assignee = task.assigneeId ? getUser(task.assigneeId) : null;
                            const project = getProject(task.projectId);

                            return (
                                <div
                                    key={task.id}
                                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors"
                                >
                                    {assignee ? (
                                        <Avatar name={assignee.name} size="sm" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-dark-200 dark:bg-dark-600 flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-dark-400" />
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-dark-800 dark:text-white font-medium truncate">
                                            {task.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <StatusBadge status={task.status} />
                                            {project && (
                                                <span className="text-xs text-dark-400 truncate">
                                                    in {project.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <span className="text-xs text-dark-400 whitespace-nowrap">
                                        {formatRelativeTime(task.updatedAt)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Card>
    );
};
