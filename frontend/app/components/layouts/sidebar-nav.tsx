import { cn } from '@/lib/utils';
import type { workSpace } from '@/types'
import { type LucideIcon } from 'lucide-react';
import React from 'react'
import { Button } from '../ui/button';
import { useLocation, useNavigate } from 'react-router';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        title: string;
        href: string;
        icon: LucideIcon
    }[];
    isCollapsed: boolean;
    className?: string;
    currentWorkspace: workSpace | null;
}

const SidebarNav = ({
    items,
    isCollapsed,
    className,
    currentWorkspace,
    ...props
}: SidebarNavProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div className={cn('flex flex-col items-start gap-y-2 w-full', className)} {...props}>
            {
                items.map((element) => {
                    const Icon = element.icon;
                    const isActive = element.href === location.pathname;

                    const handleOnClick = () => {
                        if (element.href === "/workspaces" || element.href === "/dashboard") {
                            navigate(element.href);
                        } else if (currentWorkspace && currentWorkspace._id) {
                            navigate(`${element.href}?workspaceId=${currentWorkspace._id}`);
                        } else {
                            navigate(element.href);
                        }
                    };

                    return (
                        <Button key={element.href}
                            variant={isActive ? "outline" : "ghost"}
                            onClick={handleOnClick}
                            className={cn('justify-start w-full', isActive && "bg-blue-800/4 text-blue-600 font-medium")}>
                            <Icon className={cn("mr-2 size=4")} />
                            {isCollapsed ? <span className='sr-only'>{element.title}</span> : element.title}
                        </Button>
                    )
                })
            }
        </div>
    )
}

export default SidebarNav