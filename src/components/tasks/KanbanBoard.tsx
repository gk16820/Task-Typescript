import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TASK_STATUS_CONFIG } from '../../utils/constants';
import { useData } from '../../context';

interface KanbanBoardProps {
    projectId: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
    const { tasks, updateTaskStatus } = useData();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);

    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    const columns: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];

    const getTasksByStatus = (status: TaskStatus) => {
        return projectTasks.filter((t) => t.status === status);
    };

    const handleDragStart = (e: React.DragEvent, task: Task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
        e.preventDefault();
        if (draggedTask && draggedTask.status !== status) {
            updateTaskStatus(draggedTask.id, status);
        }
        setDraggedTask(null);
    };

    const handleDragEnd = () => {
        setDraggedTask(null);
    };

    const handleAddTask = (status: TaskStatus) => {
        setNewTaskStatus(status);
        setSelectedTask(null);
        setShowTaskForm(true);
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setShowTaskForm(true);
    };

    return (
        <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((status) => {
                const config = TASK_STATUS_CONFIG[status];
                const columnTasks = getTasksByStatus(status);

                return (
                    <div
                        key={status}
                        className="flex-shrink-0 w-80"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, status)}
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${config.color}`} />
                                <h3 className="font-semibold text-dark-800 dark:text-white">
                                    {config.label}
                                </h3>
                                <span className="px-2 py-0.5 bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300 text-xs font-medium rounded-full">
                                    {columnTasks.length}
                                </span>
                            </div>
                            <button
                                onClick={() => handleAddTask(status)}
                                className="p-1.5 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4 text-dark-500" />
                            </button>
                        </div>

                        {/* Column Content */}
                        <div
                            className={`
                min-h-[500px] p-3 rounded-2xl space-y-3
                bg-dark-50 dark:bg-dark-900/50
                ${draggedTask ? 'ring-2 ring-primary-500/50 ring-dashed' : ''}
              `}
                        >
                            {columnTasks.map((task) => (
                                <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <TaskCard
                                        task={task}
                                        onClick={() => handleEditTask(task)}
                                        isDragging={draggedTask?.id === task.id}
                                    />
                                </div>
                            ))}

                            {columnTasks.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-dark-400">
                                    <p className="text-sm">No tasks</p>
                                    <button
                                        onClick={() => handleAddTask(status)}
                                        className="mt-2 text-sm text-primary-500 hover:text-primary-600 font-medium"
                                    >
                                        Add a task
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Task Form Modal */}
            {showTaskForm && (
                <TaskForm
                    isOpen={showTaskForm}
                    onClose={() => {
                        setShowTaskForm(false);
                        setSelectedTask(null);
                    }}
                    task={selectedTask || undefined}
                    defaultProjectId={projectId}
                    defaultStatus={newTaskStatus}
                />
            )}
        </div>
    );
};
