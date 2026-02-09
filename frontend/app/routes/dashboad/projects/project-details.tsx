import BackButton from '@/components/back-button';
import CreateTaskDialog from '@/components/task/create-task-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Loder from '@/components/ui/loder';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjectTasksQuery } from '@/hooks/use-project';
import { getProjectProgress } from '@/lib';
import { TaskColumn } from '@/components/task/task-column';
import { TaskStatus, type Project, type Task } from '@/types';
import React from 'react'
import { useNavigate, useParams } from 'react-router'

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
        return <Loder />
    }



    const { project, tasks } = projectData!;
    const progress = getProjectProgress(tasks);

    const handleTaskClick = (taskId: string) => {
        navigate(`/workspace/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
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