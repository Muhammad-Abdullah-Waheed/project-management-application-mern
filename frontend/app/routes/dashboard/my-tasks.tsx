import Loader from "@/components/ui/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMyTasksQuery } from "@/hooks/use-task";
import type { Task } from "@/types";
import { format } from "date-fns";
import { ArrowUpRight, CheckCircle, Clock, FilterIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

const MyTasks = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const initialFilter = searchParams.get("filter") || "all";
    const initialSort = searchParams.get("sort") || "desc";
    const initialSearch = searchParams.get("search") || "";

    const [filter, setFilter] = useState<string>(initialFilter);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
        initialSort === "asc" ? "asc" : "desc"
    );
    const [search, setSearch] = useState<string>(initialSearch);

    useEffect(() => {
        const params: Record<string, string> = {};

        searchParams.forEach((value, key) => {
            params[key] = value;
        });

        params.filter = filter;
        params.sort = sortDirection;
        params.search = search;

        setSearchParams(params, { replace: true });
    }, [filter, sortDirection, search]);

    useEffect(() => {
        const urlFilter = searchParams.get("filter") || "all";
        const urlSort = searchParams.get("sort") || "desc";
        const urlSearch = searchParams.get("search") || "";

        if (urlFilter !== filter) setFilter(urlFilter);
        if (urlSort !== sortDirection)
            setSortDirection(urlSort === "asc" ? "asc" : "desc");
        if (urlSearch !== search) setSearch(urlSearch);
    }, [searchParams]);

    const { data: myTasks, isLoading } = useGetMyTasksQuery() as {
        data: Task[];
        isLoading: boolean;
    };

    const filteredTasks =
        myTasks?.length > 0
            ? myTasks
                .filter((task) => {
                    if (filter === "all") return true;
                    if (filter === "todo") return task.status === "To Do";
                    if (filter === "inprogress") return task.status === "In Progress";
                    if (filter === "done") return task.status === "Done";
                    if (filter === "achieved") return task.isArchived === true;
                    if (filter === "high") return task.priority === "High";

                    return true;
                })
                .filter(
                    (task) =>
                        task.title.toLowerCase().includes(search.toLowerCase()) ||
                        task.description?.toLowerCase().includes(search.toLowerCase())
                )
            : [];

    //   sort task
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (a.dueDate && b.dueDate) {
            return sortDirection === "asc"
                ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
        return 0;
    });

    const todoTasks = sortedTasks.filter((task) => task.status === "To Do");
    const inProgressTasks = sortedTasks.filter(
        (task) => task.status === "In Progress"
    );
    const doneTasks = sortedTasks.filter((task) => task.status === "Done");

    if (isLoading)
        return (
            <div>
                <Loader />
            </div>
        );
    return (
        <div className="space-y-6">
            <div className="flex items-start md:items-center justify-between">
                <h1 className="text-2xl font-bold">My Tasks</h1>

                <div
                    className="flex flex-col items-start md:flex-row md"
                    itemScope
                    gap-2
                >
                    <Button
                        variant={"outline"}
                        onClick={() =>
                            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                        }
                    >
                        {sortDirection === "asc" ? "Oldest First" : "Newest First"}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"}>
                                <FilterIcon className="w-4 h-4" /> Filter
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setFilter("all")}>
                                All Tasks
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter("todo")}>
                                To Do
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter("inprogress")}>
                                In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter("done")}>
                                Done
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter("achieved")}>
                                Achieved
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter("high")}>
                                High
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Input
                placeholder="Search tasks ...."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
            />

            <Tabs defaultValue="list">
                <TabsList>
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="board">Board View</TabsTrigger>
                </TabsList>

                {/* LIST VIEW */}
                <TabsContent value="list">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Tasks</CardTitle>
                            <CardDescription>
                                {sortedTasks?.length} tasks assigned to you
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="divide-y">
                                {sortedTasks?.map((task) => (
                                    <div key={task._id} className="p-4 hover:bg-muted/50">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-3">
                                            <div className="flex">
                                                <div className="flex gap-2 mr-2">
                                                    {task.status === "Done" ? (
                                                        <CheckCircle className="size-4 text-green-500" />
                                                    ) : (
                                                        <Clock className="size-4 text-yellow-500" />
                                                    )}
                                                </div>

                                                <div>
                                                    <Link
                                                        to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                                                        className="font-medium hover:text-primary hover:underline transition-colors flex items-center"
                                                    >
                                                        {task.title}
                                                        <ArrowUpRight className="size-4 ml-1" />
                                                    </Link>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <Badge
                                                            variant={
                                                                task.status === "Done" ? "default" : "outline"
                                                            }
                                                        >
                                                            {task.status}
                                                        </Badge>

                                                        {task.priority && (
                                                            <Badge
                                                                variant={
                                                                    task.priority === "High"
                                                                        ? "destructive"
                                                                        : "secondary"
                                                                }
                                                            >
                                                                {task.priority}
                                                            </Badge>
                                                        )}

                                                        {task.isArchived && (
                                                            <Badge variant={"outline"}>Archived</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-sm text-muted-foreground space-y-1">
                                                {task.dueDate && (
                                                    <div>Due: {format(task.dueDate, "PPPP")}</div>
                                                )}

                                                <div>
                                                    Project:{" "}
                                                    <span className="font-medium">
                                                        {task.project.title}
                                                    </span>
                                                </div>

                                                <div>Modified on: {format(task.updatedAt, "PPPP")}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {sortedTasks?.length === 0 && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No tasks found
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BOARD VIEW */}
                <TabsContent value="board">
                    <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    To Do
                                    <Badge variant={"outline"}>{todoTasks?.length}</Badge>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                                {todoTasks?.map((task) => (
                                    <Card
                                        key={task._id}
                                        className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 hover:border-l-blue-600 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20"
                                    >
                                        <CardContent className="p-4">
                                            <Link
                                                to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                                                className="block space-y-3"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-2">
                                                        {task.title}
                                                    </h3>
                                                    <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary flex-shrink-0" />
                                                </div>

                                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {task.description || "No description"}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge
                                                        variant={
                                                            task.priority === "High"
                                                                ? "destructive"
                                                                : task.priority === "Medium"
                                                                    ? "default"
                                                                    : "secondary"
                                                        }
                                                        className="text-xs font-medium"
                                                    >
                                                        {task.priority}
                                                    </Badge>

                                                    {task.dueDate && (
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Clock className="size-3" />
                                                            <span>{format(new Date(task.dueDate), "MMM dd")}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pt-2 border-t text-xs text-muted-foreground">
                                                    <span className="font-medium">{task.project.title}</span>
                                                </div>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}

                                {todoTasks?.length === 0 && (
                                    <div className="p-8 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
                                        No tasks found
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    In Progress
                                    <Badge variant={"outline"}>{inProgressTasks?.length}</Badge>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                                {inProgressTasks?.map((task) => (
                                    <Card
                                        key={task._id}
                                        className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-yellow-500 hover:border-l-yellow-600 bg-gradient-to-r from-yellow-50/50 to-transparent dark:from-yellow-950/20"
                                    >
                                        <CardContent className="p-4">
                                            <Link
                                                to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                                                className="block space-y-3"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-2">
                                                        {task.title}
                                                    </h3>
                                                    <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0" />
                                                </div>

                                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {task.description || "No description"}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge
                                                        variant={
                                                            task.priority === "High"
                                                                ? "destructive"
                                                                : task.priority === "Medium"
                                                                    ? "default"
                                                                    : "secondary"
                                                        }
                                                        className="text-xs font-medium"
                                                    >
                                                        {task.priority}
                                                    </Badge>

                                                    {task.dueDate && (
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Clock className="size-3" />
                                                            <span>{format(new Date(task.dueDate), "MMM dd")}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pt-2 border-t text-xs text-muted-foreground">
                                                    <span className="font-medium">{task.project.title}</span>
                                                </div>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}

                                {inProgressTasks?.length === 0 && (
                                    <div className="p-8 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
                                        No tasks found
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    Done
                                    <Badge variant={"outline"}>{doneTasks?.length}</Badge>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                                {doneTasks?.map((task) => (
                                    <Card
                                        key={task._id}
                                        className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500 hover:border-l-green-600 bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-950/20"
                                    >
                                        <CardContent className="p-4">
                                            <Link
                                                to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                                                className="block space-y-3"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-start gap-2 flex-1 min-w-0">
                                                        <CheckCircle className="size-4 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                                                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-2">
                                                            {task.title}
                                                        </h3>
                                                    </div>
                                                    <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0" />
                                                </div>

                                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed pl-6">
                                                    {task.description || "No description"}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-2 pl-6">
                                                    <Badge
                                                        variant={
                                                            task.priority === "High"
                                                                ? "destructive"
                                                                : task.priority === "Medium"
                                                                    ? "default"
                                                                    : "secondary"
                                                        }
                                                        className="text-xs font-medium"
                                                    >
                                                        {task.priority}
                                                    </Badge>

                                                    {task.dueDate && (
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Clock className="size-3" />
                                                            <span>{format(new Date(task.dueDate), "MMM dd")}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pt-2 border-t text-xs text-muted-foreground pl-6">
                                                    <span className="font-medium">{task.project.title}</span>
                                                </div>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}

                                {doneTasks?.length === 0 && (
                                    <div className="p-8 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
                                        No tasks found
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MyTasks;
