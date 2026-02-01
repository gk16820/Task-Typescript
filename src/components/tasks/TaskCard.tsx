import React from 'react';
import { Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { Task } from '../../types';
import { Card, Avatar, StatusBadge, PriorityBadge } from '../common';
import { useData } from '../../context';
import { formatDate, isOverdue } from '../../utils/helpers';

interface TaskCardProps {
    task: Task;
    onClick?: () => void;
    isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onClick,
    isDragging = false,
}) => {
    const { getUser, getProject } = useData();
    const assignee = task.assigneeId ? getUser(task.assigneeId) : null;
    const project = getProject(task.projectId);
    const overdue = isOverdue(task.dueDate);

    return (
        <Card
            hover
            onClick={onClick}
            className={`
        group cursor-pointer
        ${isDragging ? 'opacity-50 rotate-3 scale-105 shadow-2xl' : ''}
      `}
            padding="sm"
        >
            <div className="p-3">
                {/* Priority & Tags */}
                <div className="flex items-center gap-2 mb-3">
                    <PriorityBadge priority={task.priority} />
                    {task.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300 text-xs rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <h4 className="text-sm font-medium text-dark-800 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {task.title}
                </h4>

                {/* Description preview */}
                {task.description && (
                    <p className="text-xs text-dark-500 dark:text-dark-400 line-clamp-2 mb-3">
                        {task.description}
                    </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-dark-100 dark:border-dark-700">
                    {/* Due date */}
                    {task.dueDate && (
                        <div
                            className={`
                flex items-center gap-1.5 text-xs
                ${overdue ? 'text-red-500' : 'text-dark-500 dark:text-dark-400'}
              `}
                        >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(task.dueDate)}</span>
                        </div>
                    )}

                    {/* Assignee */}
                    <div className="flex items-center gap-2 ml-auto">
                        {assignee && (
                            <Avatar name={assignee.name} size="xs" />
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};
