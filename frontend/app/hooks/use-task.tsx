import type { CreateTaskFormData } from "@/components/task/create-task-dialog";
import { getData, postData, putData } from "@/lib/fetch-util";
import type { TaskPriority, TaskStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateTaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { projectId: string; taskData: CreateTaskFormData }) =>
            postData(`/tasks/${data.projectId}/create-task`, data.taskData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["project", data.project],
            });
        },
    });
};

export const useTaskByIdQuery = (taskId: string) => {
    return useQuery({
        queryKey: ["task", taskId],
        queryFn: () => getData(`/tasks/${taskId}`),
    });
};

export const useUpdateTaskTitleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; title: string }) =>
            putData(`/tasks/${data.taskId}/title`, { title: data.title }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["task", data._id],
            });
            queryClient.invalidateQueries({
                queryKey: ["task-activity", data._id],
            });
        },
    });
};

export const useUpdateTaskStatusMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; status: TaskStatus }) =>
            putData(`/tasks/${data.taskId}/status`, { status: data.status }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["task", data._id],
            });
            queryClient.invalidateQueries({
                queryKey: ["task-activity", data._id],
            });
        },
    });
};

export const useUpdateTaskDescriptionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; description: string }) =>
            putData(`/tasks/${data.taskId}/description`, {
                description: data.description,
            }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["task", data._id],
            });
            queryClient.invalidateQueries({
                queryKey: ["task-activity", data._id],
            });
        },
    });
};

export const useUpdateTaskAssigneesMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; assignees: string[] }) =>
            putData(`/tasks/${data.taskId}/assignees`, {
                assignees: data.assignees,
            }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["task", data._id],
            });
            queryClient.invalidateQueries({
                queryKey: ["task-activity", data._id],
            });
        },
    });
};

export const useUpdateTaskPriorityMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; priority: TaskPriority }) =>
            putData(`/tasks/${data.taskId}/priority`, { priority: data.priority }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["task", data._id],
            });
            queryClient.invalidateQueries({
                queryKey: ["task-activity", data._id],
            });
        },
    });
};

export const useAddSubTaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; title: string }) =>
            postData(`/tasks/${data.taskId}/add-subtask`, { title: data.title }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["task", data._id],
            });
            queryClient.invalidateQueries({
                queryKey: ["task-activity", data._id],
            });
        },
    });
};

export const useUpdateSubTaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            taskId: string;
            subTaskId: string;
            completed: boolean;
        }) =>
            putData(`/tasks/${data.taskId}/update-subtask/${data.subTaskId}`, {
                completed: data.completed,
            }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["task", data._id],
            });
            queryClient.invalidateQueries({
                queryKey: ["task-activity", data._id],
            });
        },
    });
};

export const useAddCommentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; text: string }) =>
            postData(`/tasks/${data.taskId}/add-comment`, { text: data.text }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["comments", data.task],
            });
            queryClient.invalidateQueries({
                queryKey: ["task-activity", data.task],
            });
        },
    });
};

export const useGetCommentsByTaskIdQuery = (taskId: string) => {
    return useQuery({
        queryKey: ["comments", taskId],
        queryFn: () => getData(`/tasks/${taskId}/comments`),
    });
};

export const useWatchTaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string }) =>
            postData(`/tasks/${data.taskId}/watch`, {}),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["task", data._id],
            });
            queryClient.invalidateQueries({
                queryKey: ["task-activity", data._id],
            });
        },
    });
};

export const useAchievedTaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string }) =>
            postData(`/tasks/${data.taskId}/achieved`, {}),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["task", data._id],
            });
            queryClient.invalidateQueries({
                queryKey: ["task-activity", data._id],
            });
        },
    });
};

export const useGetMyTasksQuery = () => {
    return useQuery({
        queryKey: ["my-tasks", "user"],
        queryFn: () => getData("/tasks/my-tasks"),
    });
};
