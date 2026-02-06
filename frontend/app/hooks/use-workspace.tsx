import { useMutation, useQuery } from "@tanstack/react-query";
import { postData, getData } from "../lib/fetch-util";
import { workspaceSchema } from "../lib/schema";
import { z } from "zod";

export const useCreateWorkspaceMutation = () => {
    return useMutation({
        mutationFn: (data: z.infer<typeof workspaceSchema>) => postData("/workspaces", data),
    });
}

export const useWorkspacesQuery = () => {
    return useQuery({
        queryKey: ["workspaces"],
        queryFn: () => getData("/workspaces"),
    });
}

export const useWorkspaceQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace", workspaceId],
        queryFn: () => getData(`/workspaces/${workspaceId}`),
    });
}

export const useWorkspaceProjectsQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace", workspaceId],
        queryFn: () => getData(`/workspaces/${workspaceId}/projects`),
    });
}