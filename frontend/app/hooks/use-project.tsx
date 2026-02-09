import { useMutation, useQuery } from '@tanstack/react-query'
import { getData, postData } from '../lib/fetch-util'
import { projectSchema } from '../lib/schema'
import type z from 'zod'
import { queryClient } from '@/provider/react-query-provider'

export const useCreateProjectMutation = () => {
    return useMutation({
        mutationFn: (data: { workspaceId: string, projectData: z.infer<typeof projectSchema> }) =>
            postData(`/projects/${data.workspaceId}/create-project`, data.projectData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["workspace", data.workspaceId] });
        }
    });
}

export const useProjectTasksQuery = (projectId: string) => {
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: () => getData(`/projects/${projectId}/tasks`),
    });
}


