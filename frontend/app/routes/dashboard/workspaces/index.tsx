import React from 'react'
import { useWorkspacesQuery } from '@/hooks/use-workspace';
import Loder from '@/components/ui/loader';
import type { Workspace } from '@/types';
import CreateWorkspaceDialog from '@/components/workspace/create-workspace';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NoDataFound from '@/components/ui/no-data-found';
import { Link } from 'react-router';
import WorkspaceAvatar from '@/components/workspace/workspace-avatar';
import { format } from 'date-fns';

const Workspaces = () => {
    const [isCreatingWorkspace, setIsCreatingWorkspace] = React.useState(false);

    const { data, isLoading, error } = useWorkspacesQuery() as {
        data: { workspaces: Workspace[] },
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
        <>
            <div className='flex flex-col gap-8'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold'>Workspaces</h1>
                    </div>
                    <Button onClick={() => setIsCreatingWorkspace(true)}><PlusCircle />Create Workspace</Button>
                </div>
                <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {data.workspaces.map((workspace) => (
                        <WorkspaceCard key={workspace._id} workspace={workspace} />
                    ))}
                    {data.workspaces.length === 0 && <NoDataFound title="No Workspaces Found" description="You have not created any workspaces yet" buttonText="Create Workspace" buttonAction={() => setIsCreatingWorkspace(true)} />}
                </div>
            </div>

            <CreateWorkspaceDialog
                isOpen={isCreatingWorkspace}
                setIsCreatingWorkspace={setIsCreatingWorkspace}
            />
        </>
    )
}

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
    return (
        <Link to={`/workspaces/${workspace._id}`}>
            <Card className='cursor-pointer hover:shadow-lg hover:scale-102 hover:translate-y-1 transition-all duration-300'>
                <CardHeader className='pb-2'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <WorkspaceAvatar name={workspace.name} color={workspace.color} />
                            <div>
                                <CardTitle>{workspace.name}</CardTitle>
                                <span className='text-xs text-muted-foreground'>Created at {format(workspace.createdAt, 'MMM d, yyyy HH:mm a')}</span>
                            </div>
                        </div>

                        <div className='flex items-center text-xs text-muted-foreground'>
                            <Users className="size-4 mr-1" />
                            <span>{workspace.members.length}</span>
                        </div>
                    </div>
                    <CardDescription>{workspace.description || 'No description'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='text-xs text-muted-foreground'>View Workspace details and manage Projects</div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default Workspaces   