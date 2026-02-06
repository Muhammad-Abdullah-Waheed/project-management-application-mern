import type { workSpace } from "@/types";
import { Button } from "../ui/button";
import { Bell, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/provider/auth-context";
import { Link, useLoaderData } from "react-router";
import WorkspaceAvatar from "../workspace/workspace-avatar";



interface HeaderProps {
    onCreatingWorkspace: () => void;
    currentWorkspace: workSpace | null;
    onWorkspaceSelect: (workspace: workSpace) => void;
}

const Header = ({
    onCreatingWorkspace,
    currentWorkspace,
    onWorkspaceSelect
}: HeaderProps) => {
    const { user, logout } = useAuth();

    const { workspaces } = useLoaderData() as { workspaces: workSpace[] };

    return (
        <div className="bg-background sticky top-0 z-40 border-b">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="p-5">
                            {currentWorkspace?.color ?
                                <>
                                    <WorkspaceAvatar color={currentWorkspace.color} name={currentWorkspace.name} />
                                    <span className="font-medium">{currentWorkspace.name}</span>
                                </>
                                :
                                <>
                                    <span className="font-medium">Create Workspace</span>
                                </>
                            }
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            {workspaces?.map((workspace: workSpace) => (
                                <DropdownMenuItem key={workspace._id} onClick={() => onWorkspaceSelect(workspace)}>
                                    {workspace && <WorkspaceAvatar color={workspace.color} name={workspace.name} />}
                                    <span className="font-medium">{workspace.name}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => onCreatingWorkspace()}>
                            <PlusCircle />
                            <span className="font-medium">Create Workspace</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon"><Bell /></Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Avatar>
                                    <AvatarImage src={user?.profilePicture} />
                                    <AvatarFallback>{user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><Link to="/profile">Profile</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}

export default Header