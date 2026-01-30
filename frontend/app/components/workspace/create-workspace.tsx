import { workspaceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { useCreateWorkspaceMutation } from "@/hooks/use-workspace";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface CreateWorkspaceDialogProps {
    isOpen: boolean;
    setIsCreatingWorkspace: (open: boolean) => void;
}

// Define 9 predifine colors for workspace
export const colorsOption = [
    '#FF5733', //Red-Orange
    '#33FF57', //Green
    '#3357FF', //Blue
    '#5733FF', //Purple
    '#FF8C33', //Orange
    '#33FF8C', //Teal
    '#338CFF', //Light Blue
    '#8C33FF', //Purple
    '#A833FF', //Pink
]

const CreateWorkspaceDialog = ({
    isOpen,
    setIsCreatingWorkspace
}: CreateWorkspaceDialogProps) => {

    const form = useForm<z.infer<typeof workspaceSchema>>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
            description: "",
            color: colorsOption[0],
        },
    });



    const navigate = useNavigate();
    const { mutate: createWorkspaceMutation, isPending } = useCreateWorkspaceMutation();

    const onSubmit = (data: z.infer<typeof workspaceSchema>) => {
        createWorkspaceMutation(data, {
            onSuccess: (data: any) => {
                toast.success(data.message);
                form.reset();
                setIsCreatingWorkspace(false);
                navigate(`/workspace/${data.workspace.id}`);
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || "Failed to create workspace";
                toast.error(errorMessage);
            }
        });
    }




    return (
        <Dialog open={isOpen} onOpenChange={setIsCreatingWorkspace} modal={true}>
            <DialogContent className="max-h-[80vh] overflow-y-auto ">
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                    <DialogDescription>
                        Create a new workspace to start managing your projects.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Workspace Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Workspace Description" {...field}
                                                className="h-30 overflow-y-auto resize-none" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Color</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-3 flex-wrap">
                                                {colorsOption.map((color) => (
                                                    <div
                                                        key={color}
                                                        className={cn("w-6 h-6 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500", {
                                                            "ring-2 ring-offset-2 ring-blue-500": field.value === color,
                                                        })}
                                                        style={{ backgroundColor: color }}
                                                        onClick={() => field.onChange(color)}
                                                    />
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateWorkspaceDialog;
