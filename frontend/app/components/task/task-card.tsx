
import React from 'react';
import type { Task } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TaskCardProps {
    task: Task;
    onClick?: (taskId: string) => void;
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "Low":
            return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
        case "Medium":
            return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
        case "High":
            return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
        case "Critical":
            return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
        default:
            return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20";
    }
}

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
    return (
        <Card
            className="mb-3 hover:shadow-md transition-all cursor-pointer border-l-4"
            style={{ borderLeftColor: getPriorityColor(task.priority).split(' ')[1]?.replace('text-', '') }}
            onClick={() => onClick?.(task._id)}
        >
            <CardHeader className="p-4 pb-2 space-y-2">
                <div className="flex justify-between items-start">
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                    </Badge>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2">{task.title}</h3>
            </CardHeader>
            <CardContent className="p-4 pt-2 pb-2">
                {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {task.description}
                    </p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{format(new Date(task.dueDate), "MMM d")}</span>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-2 flex justify-between items-center">
                <div className="flex -space-x-2">
                    {task.assignees && task.assignees.slice(0, 3).map((assignee) => (
                        <Avatar key={assignee._id} className="w-6 h-6 border-2 border-background">
                            <AvatarImage src={assignee.profilePicture || ""} />
                            <AvatarFallback className="text-[10px]">
                                {assignee.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    ))}
                    {task.assignees && task.assignees.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] border-2 border-background">
                            +{task.assignees.length - 3}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ClockIcon className="w-3 h-3" />
                    {/* Placeholder for time tracking or time elapsed if needed */}
                </div>
            </CardFooter>
        </Card>
    );
};
