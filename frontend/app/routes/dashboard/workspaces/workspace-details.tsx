import { useWorkspaceProjectsQuery } from '@/hooks/use-workspace';
import React from 'react'
import { useParams } from 'react-router'
import type { workSpace, Project } from '@/types';
import Loder from '@/components/ui/loader';
import WorkspaceHeader from '@/components/workspace/workspace-header';
import ProjectList from '@/components/workspace/project-list';
import CreateProjectDialog from '@/components/project/create-project';
import { InviteMemberDialog } from '@/components/workspace/invite-member';

const WorkspaceDetails = () => {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const [isCreatingProject, setIsCreatingProject] = React.useState(false);
    const [isInvitingMember, setIsInvitingMember] = React.useState(false);

    if (!workspaceId) {
        return <div>Workspace not found</div>
    }

    const { data, isLoading, error } = useWorkspaceProjectsQuery(workspaceId) as {
        data: { message: string, projects: Project[], workspace: workSpace },
        isLoading: boolean,
        error: Error
    };

    if (isLoading) {
        return <div><Loder /></div>
    }
    if (error) {
        return <div>Error: {error.message}</div>
    }


    return (
        <div className='space-y-8 py-2'>
            <WorkspaceHeader workspace={data?.workspace}
                members={data?.workspace?.members}
                onCreateProject={() => setIsCreatingProject(true)}
                onInvitingMember={() => setIsInvitingMember(true)} />
            <ProjectList
                workspaceId={workspaceId}
                projects={data?.projects}
                onCreatingProject={setIsCreatingProject}

            />

            <CreateProjectDialog
                isOpen={isCreatingProject}
                onOpenChange={setIsCreatingProject}
                workspaceId={workspaceId}
                workspaceMembers={data?.workspace?.members as any}
            />

            <InviteMemberDialog
                isOpen={isInvitingMember}
                onOpenChange={setIsInvitingMember}
                workspaceId={workspaceId}
            />

        </div>


    )
}

export default WorkspaceDetails