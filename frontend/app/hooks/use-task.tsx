import { postData } from "@/lib/fetch-util";
import { queryClient } from "@/provider/react-query-provider";
import { useMutation } from "@tanstack/react-query";
import type { CreateTaskFormData } from "../components/task/create-task-dialog";

export const CreateTaskMutation = () => {
    return useMutation({
        mutationFn: (data: { projectId: string, taskData: CreateTaskFormData }) =>
            postData(`/tasks/${data.projectId}/create-task`, data.taskData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["project", data.projectId] });
        }
    });
}