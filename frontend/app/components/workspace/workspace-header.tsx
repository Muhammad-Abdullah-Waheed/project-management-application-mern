import type { User, Workspace } from "@/types"
import { Button } from "../ui/button"
import WorkspaceAvatar from "./workspace-avatar"
import { PlusCircleIcon, PlusIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface WorkspaceHeaderProps {
    workspace: Workspace,
    members: {
        user: User,
        role: "owner" | "admin" | "member" | "viewer"
        joinDate: Date
    }[],
    onCreateProject: () => void,
    onInvitingMember: () => void
}

const WorkspaceHeader = ({ workspace, members, onCreateProject, onInvitingMember }: WorkspaceHeaderProps) => {
    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3">
                    <div className="flex md:items-center md:justify-start gap-3">
                        {
                            workspace.color && (<WorkspaceAvatar name={workspace.name} color={workspace.color} />)
                        }
                        <h2 className="md:text-2xl text-xl font-semibold">{workspace.name}</h2>
                    </div>
                    <div className="flex items-center justify-between md:justify-start md:px-4 mb-4 md:mb-0 gap-3">
                        <Button
                            variant="outline"
                            onClick={onInvitingMember}
                            className="hover:scale-103 transition-all shadow-sm">
                            <PlusIcon className="size-4 mr-2" />Invite Member
                        </Button>
                        <Button onClick={onCreateProject} className="hover:scale-103 transition-all shadow-sm">
                            <PlusCircleIcon className="size-4 mr-2" />Create Project
                        </Button>
                    </div>
                </div>
                {
                    workspace.description && (
                        <p className="text-sm md:text-base text-muted-foreground">
                            {workspace.description}
                        </p>
                    )
                }
            </div>
            {
                members.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Members</span>
                        <div className="flex space-x-2">{members.map((member, index) => (
                            <Avatar key={index}
                                className="relative h-8 w-8 rounded-full border-2 border-background overflow-hidden"
                                title={member.user.name}>
                                <AvatarImage src={member.user.profilePicture} />
                                <AvatarFallback>{member.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>

                        ))}
                        </div>

                    </div>
                )
            }
        </div>
    )
}

export default WorkspaceHeader