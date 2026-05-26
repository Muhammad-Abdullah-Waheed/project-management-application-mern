import type { Project } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Link } from 'react-router'
import { Users } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { getTaskStatusColor } from '@/lib'
import { Progress } from '../ui/progress'


interface ProjectCardProps {
    project: Project,
    workspaceId: string,
    progress: number
}
const ProjectCard = (
    {
        project,
        workspaceId,
        progress
    }: ProjectCardProps
) => {
    return (
        <Link to={`/workspaces/${workspaceId}/projects/${project._id}`}>
            <Card className='cursor-pointer hover:shadow-lg hover:scale-102 hover:translate-y-1 transition-all duration-300'>
                <CardHeader className='pb-2'>
                    <div className='flex items-center justify-between'>
                        <CardTitle>
                            {project.title}
                        </CardTitle>
                        <span className={cn('text-xs rounded-full', getTaskStatusColor(project.status))}>
                            {project.status}
                        </span>
                    </div>
                    <CardDescription className='line-clamp-2'>
                        {project.description || "No description"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='space-y-3'>
                        <div className='text-sm'>Progress</div>
                        <Progress className='h-2' value={progress} />
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                <span>{project.tasks.length} Tasks</span>
                            </div>
                            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                <span>{project.members.length} </span>
                                <Users size={16} />
                            </div>
                        </div>
                        {project.dueDate && (
                            <div className='flex items-center justify-between text-xs'>
                                <span >Due Date</span>
                                <span >{format(new Date(project.dueDate), "MMM dd, yyyy")}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default ProjectCard