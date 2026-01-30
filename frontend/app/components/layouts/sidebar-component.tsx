import type { workSpace } from "@/types"
import { useAuth } from "@/provider/auth-context"
import React from "react";
import { LayoutDashboard, ListCheck, LogOut, Settings, SidebarCloseIcon, SidebarOpenIcon, Trophy, Users, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import SidebarNav from "./sidebar-nav";

const SidebarComponent = ({ currentWorkspace }: { currentWorkspace: workSpace | null }) => {
    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const navItems = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Workspaces",
            href: "/workspaces",
            icon: Users,
        },
        {
            title: "My Tasks",
            href: "/my-tasks",
            icon: ListCheck,
        },
        {
            title: "Members",
            href: "/members",
            icon: Users,
        },
        {
            title: "Achieved",
            href: "/achieved",
            icon: Trophy,
        },
        {
            title: "Settings",
            href: "/settings",
            icon: Settings,
        }

    ]
    return (

        <div className={cn("flex flex-col border-r bg-sidebar transition-all duration-400",
            isCollapsed ? " w-16 md:w-[80px]" : "w-16 md:w-[240px]")}>

            <div className="flex items-center h-14 px-4 mb-4">
                <Link className="w-full" to="/dashboard">
                    {!isCollapsed &&
                        <div className="flex items-center gap-2">
                            <Wrench className="size-6 text-blue-600" />
                            <span className="font-semibold text-xl hidden md:block">
                                TaskPilot
                            </span>
                        </div>
                    }

                </Link>
                <Button variant="outline" className="rounded-full hidden md:block" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <SidebarOpenIcon className="size-5" /> : <SidebarCloseIcon className="size-5" />}
                </Button>
            </div>

            <ScrollArea className="flex-1 px-3 py-2">
                <SidebarNav
                    items={navItems}
                    isCollapsed={isCollapsed}
                    className={cn(isCollapsed && "items-center space-y-2")}
                    currentWorkspace={currentWorkspace}
                />
            </ScrollArea>

            <div className="w-full flex sm:justify-center ml-3 md:justify-start">
                <Button variant="ghost" size={isCollapsed ? "icon" : "default"}
                    onClick={() => logout()}><LogOut
                        className={cn("size=5 w-full", isCollapsed && "mr-2")} />
                    {isCollapsed ? <span className='sr-only'>Logout</span> : <span className="hidden md:block">Logout</span>}
                </Button>
            </div>

        </div>
    )
}

export default SidebarComponent