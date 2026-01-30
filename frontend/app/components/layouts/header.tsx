import type { workSpace } from "@/types";
import { Button } from "../ui/button";
import { Bell, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/provider/auth-context";
import { Link } from "react-router";
import WorkspaceAvatar from "../workspace/workspace-avatar";


const workSpaces: workSpace[] = [{
    _id: "1",
    name: "WorkSpace 1",
    description: "WorkSpace 1",
    owner: "1",
    members: [
        {
            user: "1",
            role: "owner",
            joinDate: new Date(),
        },
    ],
    color: "#000000",
    createdAt: new Date(),
    updatedAt: new Date(),
}, {
    _id: "2",
    name: "WorkSpace 2",
    description: "WorkSpace 2",
    owner: "2",
    members: [
        {
            user: "2",
            role: "owner",
            joinDate: new Date(),
        },
    ],
    color: "#000000",
    createdAt: new Date(),
    updatedAt: new Date(),
}, {
    _id: "3",
    name: "WorkSpace 3",
    description: "WorkSpace 3",
    owner: "3",
    members: [
        {
            user: "3",
            role: "owner",
            joinDate: new Date(),
        },
    ],
    color: "#000000",
    createdAt: new Date(),
    updatedAt: new Date(),
}]


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
                            {workSpaces?.map((workspace: workSpace) => (
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