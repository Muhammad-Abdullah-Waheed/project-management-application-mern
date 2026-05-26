import { ProjectStatus, type MemberProps } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import type z from "zod";
import { projectSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { useCreateProjectMutation } from "@/hooks/use-project";
import { toast } from "sonner";
import { queryClient } from "@/provider/react-query-provider";

interface CreateProjectProps {
    isOpen: boolean;
    onOpenChange: (value: boolean) => void;
    workspaceId: string;
    workspaceMembers: MemberProps[];
}

export type CeateProjectFormData = z.infer<typeof projectSchema>

const CreateProjectDialog = ({ isOpen, onOpenChange, workspaceId, workspaceMembers }: CreateProjectProps) => {
    const form = useForm<CeateProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: "",
            description: "",
            status: ProjectStatus.PLANNING,
            startDate: "",
            dueDate: "",
            progress: 0,
            members: [],
            tags: undefined,
        },
    })

    const { mutate, isPending, error } = useCreateProjectMutation()

    const onSubmit = (data: CeateProjectFormData) => {
        if (!workspaceId) return;

        mutate({ workspaceId, projectData: data }, {
            onSuccess: (data) => {
                console.log(data)
                toast.success("Project created successfully");
                form.reset();
                onOpenChange(false)
            },
            onError: (error) => {
                console.log(error)
                const err = error.message || "Failed to create project";
                toast.error(err);
            }
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[540px]">

                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                        Create a new project to start managing your tasks.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Feild for Project Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Project Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Feild for Project Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Project Description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Feild for Project Status */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Status</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Project Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(ProjectStatus).map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            {/* Feild for Project Start Date */}
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Popover modal={true}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={"w-60 justify-start text-left font-normal "
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

                            {/* Feild for Project Due Date */}
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
                        </div>

                        {/* Feild for Project Progress */}
                        <FormField
                            control={form.control}
                            name="progress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Progress</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Progress"
                                            min={0}
                                            max={100}
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Feild for Project Members */}
                        <FormField
                            control={form.control}
                            name="members"
                            render={({ field }) => {
                                const selectedMembers = field.value || [];
                                return (
                                    <FormItem>
                                        <FormLabel>Members</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-start text-left font-normal min-h-11">
                                                        {selectedMembers.length === 0 ? (
                                                            <span className='text-muted-foreground'>Select Members</span>
                                                        ) : (
                                                            selectedMembers.length <= 2 ? (
                                                                selectedMembers.map((m) => {
                                                                    const member = workspaceMembers.find((wm) => wm.user._id === m.user);
                                                                    return `${member?.user.name} (${member?.role})`
                                                                })
                                                            ) :
                                                                (
                                                                    `${selectedMembers.length} members selected`
                                                                )
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-sm max-w-80 overflow-auto " align="start">
                                                    <div className="flex flex-col gap-2">
                                                        {workspaceMembers.map((member) => {
                                                            const selectedMember = selectedMembers.find((m) => m.user === member.user._id);
                                                            return <div key={member.user._id}
                                                                className="flex items-center gap-2 p-2 border rounded">
                                                                <Checkbox
                                                                    checked={!!selectedMember}
                                                                    onCheckedChange={(checked) => {
                                                                        if (checked) {
                                                                            field.onChange([...selectedMembers, { user: member.user._id, role: member.role }]);
                                                                        } else {
                                                                            field.onChange(selectedMembers.filter((m) => m.user !== member.user._id));
                                                                        }
                                                                    }}
                                                                    id={`member-${member.user._id}`}
                                                                />
                                                                <span className="truncate flex-1">{member.user.name}</span>
                                                                {
                                                                    selectedMember && (
                                                                        <Select
                                                                            value={selectedMember.role}
                                                                            onValueChange={(value) => {
                                                                                field.onChange(selectedMembers.map((m) => m.user === member.user._id ? {
                                                                                    ...m,
                                                                                    role: value as "manager" | "contributor" | "viewer"
                                                                                } : m));
                                                                            }}
                                                                        >
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select Role" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="manager">Manager</SelectItem>
                                                                                <SelectItem value="contributor">Contributor</SelectItem>
                                                                                <SelectItem value="viewer">Viewer</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    )
                                                                }
                                                            </div>
                                                        })}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        {/* Feild for Project Tags */}
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tags (comma separated)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create Project"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateProjectDialog