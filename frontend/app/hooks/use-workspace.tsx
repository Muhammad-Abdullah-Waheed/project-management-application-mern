import { useMutation } from "@tanstack/react-query";
import { postData } from "../lib/fetch-util";
import { workspaceSchema } from "../lib/schema";
import { z } from "zod";

export const useCreateWorkspaceMutation = () => {
    return useMutation({
        mutationFn: (data: z.infer<typeof workspaceSchema>) => postData("/workspaces", data),
    });
}