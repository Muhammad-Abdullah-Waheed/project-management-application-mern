import type { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { inviteMemberSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Check, Copy, Mail } from "lucide-react";
import { Label } from "../ui/label";
import { useInviteMemberMutation } from "@/hooks/use-workspace";
import { toast } from "sonner";

interface InviteMemberDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
}
export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

const ROLES = ["admin", "member", "viewer"] as const;

export const InviteMemberDialog = ({
    isOpen,
    onOpenChange,
    workspaceId,
}: InviteMemberDialogProps) => {
    const [inviteTab, setInviteTab] = useState("email");
    const [linkCopied, setLinkCopied] = useState(false);

    const form = useForm<InviteMemberFormData>({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            email: "",
            role: "member",
        },
    });

    const { mutate, isPending } = useInviteMemberMutation();

    const onSubmit = async (data: InviteMemberFormData) => {
        if (!workspaceId) return;

        mutate(
            {
                workspaceId,
                ...data,
            },
            {
                onSuccess: () => {
                    toast.success("Invite sent successfully");
                    form.reset();
                    setInviteTab("email");
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || "Failed to send invite");
                    console.log(error);
                },
            }
        );
    };

    const handleCopyInviteLink = () => {
        const inviteLink = `${window.location.origin}/workspace-invite/${workspaceId}`;
        navigator.clipboard.writeText(inviteLink);
        setLinkCopied(true);

        setTimeout(() => {
            setLinkCopied(false);
        }, 3000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite to Workspace</DialogTitle>
                </DialogHeader>

                <Tabs
                    defaultValue="email"
                    value={inviteTab}
                    onValueChange={setInviteTab}
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="email" disabled={isPending}>
                            Send Email
                        </TabsTrigger>
                        <TabsTrigger value="link" disabled={isPending}>
                            Share Link
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email">
                        <div className="grid gap-4 py-4">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter email address" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select Role</FormLabel>
                                                <FormControl>
                                                    <div className="flex gap-3 flex-wrap">
                                                        {ROLES.map((role) => (
                                                            <label
                                                                key={role}
                                                                className="flex items-center cursor-pointer gap-2"
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    value={role}
                                                                    className="peer hidden"
                                                                    checked={field.value === role}
                                                                    onChange={() => field.onChange(role)}
                                                                />
                                                                <span
                                                                    className={cn(
                                                                        "w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center transition-all",
                                                                        field.value === role && "border-blue-600 bg-blue-600"
                                                                    )}
                                                                >
                                                                    {field.value === role && (
                                                                        <Check className="size-3 text-white" />
                                                                    )}
                                                                </span>
                                                                <span className="capitalize text-sm font-medium">{role}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isPending}
                                    >
                                        {isPending ? "Sending..." : (
                                            <>
                                                <Mail className="w-4 h-4 mr-2" />
                                                Send Invite
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </TabsContent>

                    <TabsContent value="link">
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Share this link to invite people</Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        readOnly
                                        value={`${window.location.origin}/workspace-invite/${workspaceId}`}
                                    />
                                    <Button onClick={handleCopyInviteLink} size="icon" variant="outline">
                                        {linkCopied ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Anyone with the link can join this workspace as a member.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
