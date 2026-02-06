import Header from "@/components/layouts/header";
import Loder from "@/components/ui/loder";
import { useAuth } from "@/provider/auth-context";
import { Navigate, Outlet } from "react-router"
import type { Workspace } from "@/types";
import React from "react";
import SidebarComponent from "@/components/layouts/sidebar-component";
import CreateWorkspaceDialog from "@/components/workspace/create-workspace";
import { getData } from "@/lib/fetch-util";

export const clientLoader = async () => {
    try {
        const response = await Promise.all([getData("/workspaces")]);
        const workspaces = response[0].workspaces;
        return { workspaces };
    } catch (error) {
        console.log(error);
        return error;
    }
}


const DashBoardLayout = () => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const [currentWorkspace, setCurrentWorkspace] = React.useState<Workspace | null>(null);
    const [isCreatingWorkspace, setIsCreatingWorkspace] = React.useState(false);

    if (isLoading) {
        return <div><Loder /></div>
    }
    if (!isAuthenticated) {
        return <Navigate to="/sign-in" />;
    }
    return (
        <div className="flex h-screen w-full">
            <div>
                <SidebarComponent currentWorkspace={currentWorkspace} />
            </div>
            <div className="flex flex-1 flex-col h-full">
                <Header
                    onCreatingWorkspace={() => setIsCreatingWorkspace(true)}
                    currentWorkspace={currentWorkspace}
                    onWorkspaceSelect={(workspace: Workspace) => setCurrentWorkspace(workspace)}
                />

                <main className="flex-1 overflow-auto h-full w-full">
                    <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-0 md:py-8 w-full h-full">
                        <Outlet />
                    </div>
                </main>
            </div>

            <CreateWorkspaceDialog
                isOpen={isCreatingWorkspace}

                setIsCreatingWorkspace={setIsCreatingWorkspace}
            />
        </div>
    )
}

export default DashBoardLayout;