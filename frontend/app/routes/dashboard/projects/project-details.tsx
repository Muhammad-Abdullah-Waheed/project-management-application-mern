import BackButton from '@/components/back-button';
import { CreateTaskDialog } from '@/components/task/create-task-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjectTasksQuery } from '@/hooks/use-project';
import { getProjectProgress } from '@/lib';
import { TaskStatus, type Project, type Task } from '@/types';
import React from 'react'
import { useNavigate, useParams } from 'react-router'
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertCircle, Calendar, CheckCircle, CheckCircleIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

const ProjectDetails = () => {
    const { workspaceId, projectId } = useParams<{ workspaceId: string, projectId: string }>();

    const navigate = useNavigate();

    const [isCreatingTask, setIsCreatingTask] = React.useState(false);
    const [taskFilter, setTaskFilter] = React.useState<TaskStatus | "All">("All");

    const { data: projectData, isLoading, isError } = useProjectTasksQuery(projectId!) as {
        data: { project: Project, tasks: Task[] } | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    if (isError) {
        return <div>There is something wrong</div>
    }

    if (isLoading) {
        return <Loader />
    }



    const { project, tasks } = projectData!;
    const progress = getProjectProgress(tasks);

    const handleTaskClick = (taskId: string) => {
        navigate(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
    }

    const filteredTasks = tasks.filter((task) => {
        if (taskFilter === "All") {
            return true;
        }
        return task.status === taskFilter;
    });



    return (
        <div className='space-y-8'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div className='space-y-2'>
                    <BackButton />
                    <h1 className='text-xl md:text-2xl font-bold'>{project.title}</h1>
                    {
                        project.description && (
                            <p className='text-sm text-muted-foreground'>{project.description}</p>
                        )
                    }
                </div>
                <div className='flex flex-col sm:flex-row gap-3 mr-2 sm:mr-1'>
                    <div className='flex items-center gap-2 min-w-34'>
                        <p className='text-sm font-semibold'>Progress:</p>
                        <Progress value={progress} className='h-2' />
                        <p className='text-sm font-semibold'>{progress}%</p>
                    </div>
                    <Button onClick={() => setIsCreatingTask(true)}>
                        Add Task
                    </Button>
                </div>
            </div>

            <div className='flex items-center justify-between'>
                <Tabs defaultValue="all" className='w-full'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
                        <TabsList>
                            <TabsTrigger value="all" onClick={() => setTaskFilter("All")}>All Tasks</TabsTrigger>
                            <TabsTrigger value="todo" onClick={() => setTaskFilter(TaskStatus.ToDo)}>To Do</TabsTrigger>
                            <TabsTrigger value="in-progress" onClick={() => setTaskFilter(TaskStatus.InProgress)}>In Progress</TabsTrigger>
                            <TabsTrigger value="done" onClick={() => setTaskFilter(TaskStatus.Done)}>Done</TabsTrigger>
                        </TabsList>

                        <div className='flex items-center text-sm gap-2'>
                            <span className='text-muted-foreground'>Status</span>
                            <div className='flex items-center gap-2'>
                                <Badge variant="outline" className='bg-background'>
                                    {tasks.filter((task) => task.status === "To Do").length} To Do
                                </Badge>
                                <Badge variant="outline" className='bg-background'>
                                    {tasks.filter((task) => task.status === "In Progress").length} In Progress
                                </Badge>
                                <Badge variant="outline" className='bg-background'>
                                    {tasks.filter((task) => task.status === "Done").length} Done
                                </Badge>
                            </div>

                        </div>
                    </div>

                    <TabsContent value="all" className='m-0'>
                        <div className='grid grid-cols-3 gap-4'>
                            <TaskColumn
                                title="To Do"
                                tasks={filteredTasks.filter((task) => task.status === TaskStatus.ToDo)}
                                onTaskClick={handleTaskClick}
                            />
                            <TaskColumn
                                title="In Progress"
                                tasks={filteredTasks.filter((task) => task.status === TaskStatus.InProgress)}
                                onTaskClick={handleTaskClick}
                            />
                            <TaskColumn
                                title="Done"
                                tasks={filteredTasks.filter((task) => task.status === TaskStatus.Done)}
                                onTaskClick={handleTaskClick}
                            />

                        </div>
                    </TabsContent>

                    <TabsContent value="todo" className='m-0'>
                        <TaskColumn
                            title="To Do"
                            tasks={filteredTasks.filter((task) => task.status === TaskStatus.ToDo)}
                            onTaskClick={handleTaskClick}
                        />
                    </TabsContent>

                    <TabsContent value="in-progress" className='m-0'>
                        <TaskColumn
                            title="In Progress"
                            tasks={filteredTasks.filter((task) => task.status === TaskStatus.InProgress)}
                            onTaskClick={handleTaskClick}
                        />
                    </TabsContent>

                    <TabsContent value="done" className='m-0'>
                        <TaskColumn
                            title="Done"
                            tasks={filteredTasks.filter((task) => task.status === TaskStatus.Done)}
                            onTaskClick={handleTaskClick}
                        />
                    </TabsContent>
                </Tabs>

            </div>

            <CreateTaskDialog
                open={isCreatingTask} onOpenChange={setIsCreatingTask}
                projectId={projectId!} projectMembers={project.members as any} />

        </div>
    )
}



export default ProjectDetails


interface TaskColumnProps {
    title: string;
    tasks: Task[];
    onTaskClick: (taskId: string) => void;
    isFullWidth?: boolean;
}

const TaskColumn = ({
    title,
    tasks,
    onTaskClick,
    isFullWidth = false,
}: TaskColumnProps) => {
    return (
        <div
            className={
                isFullWidth
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : ""
            }
        >
            <div
                className={cn(
                    "space-y-4",
                    !isFullWidth ? "h-full" : "col-span-full mb-4"
                )}
            >
                {!isFullWidth && (
                    <div className="flex items-center justify-between">
                        <h1 className="font-medium">{title}</h1>
                        <Badge variant="outline">{tasks.length}</Badge>
                    </div>
                )}

                <div
                    className={cn(
                        "space-y-3",
                        isFullWidth && "grid grid-cols-2 lg:grid-cols-3 gap-4"
                    )}
                >
                    {tasks.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground">
                            No tasks yet
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onClick={() => onTaskClick(task._id)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const TaskCard = ({ task, onClick }: { task: Task; onClick: () => void }) => (
    <Card
        onClick={onClick}
        className="cursor-pointer hover:shadow-md transition-all duration-300 hover:translate-y-1"
    >
        <CardHeader>
            <div className="flex items-center justify-between">
                <Badge
                    className={task.priority === "High"
                        ? "bg-red-500 text-white"
                        : task.priority === "Medium"
                            ? "bg-orange-500 text-white"
                            : "bg-slate-500 text-white"}
                >
                    {task.priority}
                </Badge>

                <div className="flex gap-1">
                    {task.status !== "To Do" && (
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="size-6"
                            onClick={() => {
                                console.log("mark as to do");
                            }}
                            title="Mark as To Do"
                        >
                            <AlertCircle className={cn("size-4")} />
                            <span className="sr-only">Mark as To Do</span>
                        </Button>
                    )}
                    {task.status !== "In Progress" && (
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="size-6"
                            onClick={() => {
                                console.log("mark as in progress");
                            }}
                            title="Mark as In Progress"
                        >
                            <Clock className={cn("size-4")} />
                            <span className="sr-only">Mark as In Progress</span>
                        </Button>
                    )}
                    {task.status !== "Done" && (
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="size-6"
                            onClick={() => {
                                console.log("mark as done");
                            }}
                            title="Mark as Done"
                        >
                            <CheckCircle className={cn("size-4")} />
                            <span className="sr-only">Mark as Done</span>
                        </Button>
                    )}
                </div>
            </div>
        </CardHeader>

        <CardContent>
            <h4 className="ont-medium mb-2">{task.title}</h4>

            {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {task.description}
                </p>
            )}

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    {task.assignees && task.assignees.length > 0 && (
                        <div className="flex -space-x-2">
                            {task.assignees.slice(0, 5).map((member) => (
                                <Avatar
                                    key={member._id}
                                    className="relative size-8 bg-gray-700 rounded-full border-2 border-background overflow-hidden"
                                    title={member.name}
                                >
                                    <AvatarImage src={member.profilePicture} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            ))}

                            {task.assignees.length > 5 && (
                                <span className="text-xs text-muted-foreground">
                                    + {task.assignees.length - 5}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {task.dueDate && (
                    <div className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="size-3 mr-1" />
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                    </div>
                )}
            </div>

            {task.subtasks && task.subtasks.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                    {task.subtasks.filter((subtask) => subtask.completed).length} /{" "}
                    {task.subtasks.length} subtasks
                </div>
            )}
        </CardContent>
    </Card>
);
