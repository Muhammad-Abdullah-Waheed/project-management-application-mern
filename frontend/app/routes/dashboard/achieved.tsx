import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetMyTasksQuery } from "@/hooks/use-task";
import type { Task } from "@/types";
import { format } from "date-fns";
import { CheckCircle2, Trophy, Calendar } from "lucide-react";
import Loader from "@/components/ui/loader";

const Achieved = () => {
    const { data: tasks, isLoading } = useGetMyTasksQuery() as {
        data: Task[];
        isLoading: boolean;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader />
            </div>
        );
    }

    const completedTasks = tasks?.filter((task) => task.status === "Done") || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Trophy className="size-8 text-yellow-500" />
                        Achievements
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Celebrate your completed tasks and milestones
                    </p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                    {completedTasks.length} Completed
                </Badge>
            </div>

            {completedTasks.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Trophy className="size-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Achievements Yet</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            Complete your first task to start building your achievement collection!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedTasks.map((task) => (
                        <Card
                            key={task._id}
                            className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <CheckCircle2 className="size-5 text-green-500" />
                                        {task.title}
                                    </CardTitle>
                                </div>
                                <CardDescription className="line-clamp-2">
                                    {task.description || "No description provided"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="size-4" />
                                    <span>
                                        Completed:{" "}
                                        {task.updatedAt
                                            ? format(new Date(task.updatedAt), "MMM dd, yyyy")
                                            : "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={
                                            task.priority === "High"
                                                ? "destructive"
                                                : task.priority === "Medium"
                                                    ? "default"
                                                    : "secondary"
                                        }
                                        className="capitalize"
                                    >
                                        {task.priority}
                                    </Badge>
                                    {task.dueDate && (
                                        <Badge variant="outline">
                                            Due: {format(new Date(task.dueDate), "MMM dd")}
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Achieved;
