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









export const useGetWorkspaceStatsQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace", workspaceId, "stats"],
        queryFn: async () => getData(`/workspaces/${workspaceId}/stats`),
        enabled: !!workspaceId,
    });
};

export const useGetWorkspaceDetailsQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace", workspaceId, "details"],
        queryFn: async () => getData(`/workspaces/${workspaceId}`),
    });
};

export const useInviteMemberMutation = () => {
    return useMutation({
        mutationFn: (data: { email: string; role: string; workspaceId: string }) =>
            postData(`/workspaces/${data.workspaceId}/invite-member`, data),
    });
};

export const useAcceptInviteByTokenMutation = () => {
    return useMutation({
        mutationFn: (token: string) =>
            postData(`/workspaces/accept-invite-token`, {
                token,
            }),
    });
};

export const useAcceptGenerateInviteMutation = () => {
    return useMutation({
        mutationFn: (workspaceId: string) =>
            postData(`/workspaces/${workspaceId}/accept-generate-invite`, {}),
    });
};
