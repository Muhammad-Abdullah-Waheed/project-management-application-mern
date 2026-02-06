import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { postData } from '../lib/fetch-util'
import { projectSchema } from '../lib/schema'
import type z from 'zod'
import { useQueryClient } from '@tanstack/react-query'

export const useCreateProjectMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { workspaceId: string, projectData: z.infer<typeof projectSchema> }) =>
            postData(`/projects/${data.workspaceId}/create-project`, data.projectData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["workspace", data.workspaceId] });
        }
    });
}