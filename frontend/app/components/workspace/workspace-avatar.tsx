import React from 'react'
import { Avatar } from '../ui/avatar';

const WorkspaceAvatar = ({
    color,
    name
}: {
    color: string;
    name: string;
}) => {
    return (
        <Avatar className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold`} style={{ backgroundColor: color }}>
            {name.charAt(0).toUpperCase()}
        </Avatar>
    )
}

export default WorkspaceAvatar