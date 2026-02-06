import type { Project } from '@/types';
import NoDataFound from '../ui/no-data-found';
import ProjectCard from '../project/project-card';

interface ProjectListProps {
    workspaceId: string;
    projects: Project[];
    onCreatingProject: (value: boolean) => void;
}
const ProjectList = ({ workspaceId, projects, onCreatingProject }: ProjectListProps) => {
    return (
        <div>
            <h3 className='text-xl font-medium mb-4'>Projects</h3>
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {
                    projects.length === 0 ? (
                        <NoDataFound
                            title="No projects found"
                            description="You have not created any projects yet"
                            buttonText="Create Project"
                            buttonAction={() => onCreatingProject(true)} />
                    ) : (
                        projects.map((project) => {
                            const progress = 0;
                            return (
                                <ProjectCard key={project._id}
                                    project={project}
                                    workspaceId={workspaceId}
                                    progress={project.progress} />
                            )
                        })
                    )
                }

            </div>

        </div>
    )
}


export default ProjectList