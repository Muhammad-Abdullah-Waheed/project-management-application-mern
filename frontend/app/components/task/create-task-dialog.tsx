import type { ProjectMemberRole, User } from "@/types";
import { useForm } from "react-hook-form";
import { createTaskSchema } from "@/lib/schema";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTaskMutation } from "@/hooks/use-task";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";

interface CreateTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    projectMembers: { user: User; role: ProjectMemberRole }[];
}
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
const CreateTaskDialog = ({
    open,
    onOpenChange,
    projectId,
    projectMembers
}: CreateTaskDialogProps
) => {
    const { mutate, isPending } = CreateTaskMutation();

    const onSubmit = async (data: CreateTaskFormData) => {
        console.log(data);
        mutate(
            {
                projectId,
                taskData: data
            },
            {
                onSuccess: () => {
                    toast.success("Task created successfully");
                    form.reset();
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    const errorMessage = error.response?.data?.message || "Failed to create task";
                    toast.error(errorMessage);
                    console.log(error);
                }
            }
        );
    }
    const form = useForm<CreateTaskFormData>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "To Do",
            priority: "Medium",
            dueDate: "",
            assignees: [],
        }
    })
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid py-4 gap-4">
                            <div className="grid gap-2 space-y-2">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Task Title" />
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
                                                <Input {...field} placeholder="Task Description" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="w-full flex gap-4">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem className="w-full" >
                                                <FormLabel>Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="To Do">To Do</SelectItem>
                                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                                        <SelectItem value="Done">Done</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="priority"
                                        render={({ field }) => (
                                            <FormItem className="w-full" >
                                                <FormLabel>Priority</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Priority" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Low">Low</SelectItem>
                                                        <SelectItem value="Medium">Medium</SelectItem>
                                                        <SelectItem value="High">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="dueDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Due Date</FormLabel>
                                            <FormControl>
                                                <Popover modal={true}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={"w-60 justify-start text-left font-normal"
                                                                + (field.value ? "text-muted-foreground truncate" : "")}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? format(field.value, "PPPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? new Date(field.value) : undefined}
                                                            onSelect={(date) => field.onChange(date?.toISOString() || undefined)}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="assignees"
                                    render={({ field }) => {
                                        const selectedAssignee = field.value || [];
                                        return (
                                            <FormItem>
                                                <FormLabel>Assignee</FormLabel>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                                                            >
                                                                {selectedAssignee.length === 0 ? <span> Select Assignee</span>
                                                                    : selectedAssignee.length <= 2 ? selectedAssignee.map((m) => {
                                                                        const member = projectMembers.find((wm) => wm.user._id === m);
                                                                        return `${member?.user.name}`;
                                                                    }).join(", ")
                                                                        : `${selectedAssignee.length} Assignees selected`}
                                                            </Button>
                                                        </PopoverTrigger>

                                                        <PopoverContent className="flex flex-col gap-2">
                                                            {projectMembers.map((member) => {
                                                                const selectedMember = selectedAssignee.includes(member.user._id);
                                                                return (
                                                                    <div key={member.user._id}>
                                                                        <Checkbox
                                                                            checked={selectedMember}
                                                                            onCheckedChange={(checked) => {
                                                                                if (checked) {
                                                                                    field.onChange([...selectedAssignee, member.user._id]);
                                                                                } else {
                                                                                    field.onChange(selectedAssignee.filter((id) => id !== member.user._id));
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span className="ml-2">{member.user.name}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                            </div>

                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create Task"}</Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}

export default CreateTaskDialog