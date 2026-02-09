
import React from 'react';
import type { Task } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskCard } from "./task-card";
import { Badge } from "@/components/ui/badge";

interface TaskColumnProps {
    title: string;
    tasks: Task[];
    onTaskClick?: (taskId: string) => void;
}

export const TaskColumn = ({ title, tasks, onTaskClick }: TaskColumnProps) => {
    return (
        <div className="flex flex-col h-full bg-muted/30 rounded-lg p-4 border w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">{title}</h3>
                <Badge variant="secondary" className="bg-muted-foreground/10 text-muted-foreground">
                    {tasks.length}
                </Badge>
            </div>

            <ScrollArea className="flex-1 h-[calc(100vh-280px)] pr-2">
                <div className="flex flex-col gap-1 pb-4">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onClick={onTaskClick}
                        />
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-md">
                            No tasks yet
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};
