export interface User {
    _id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    updatedAt: Date;
    profilePicture?: string;
    createdAt: Date;
}

export interface Workspace {
    _id: string;
    name: string;
    description?: string;
    owner: User | string;
    members: {
        user: User;
        role: "owner" | "admin" | "member" | "viewer";
        joinDate: Date;
    }[];
    color: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum ProjectStatus {
    PLANNING = "Planing",
    IN_PROGRESS = "In Progress",
    ON_HOLD = "On Hold",
    COMPLETED = "Completed",
    CANCELLED = "Cancelled",
}
export interface Project {
    _id: string;
    title: string;
    description?: string;
    status: ProjectStatus;
    workspace: Workspace;
    startDate: Date;
    dueDate: Date;
    progress: number;
    tasks: Task[];
    members: { user: User; role: "manager" | "contributor" | "viewer"; joinDate: Date; }[];
    tags: string[];
    isArchived: boolean;
}

export enum TaskStatus {
    ToDo = "To Do",
    InProgress = "In Progress",
    Review = "Review",
    Done = "Done",
    Cancelled = "Cancelled",
}

export type TaskPriority = "Low" | "Medium" | "High";


export interface Subtask {
    _id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
}

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    project: Project;
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
    dueDate: Date;
    priority: TaskPriority;
    assignee: User | string;
    createdBy: User | string;
    assignees: User[];
    subtasks?: Subtask[];
    watchers?: User[];
    attachments?: Attachment[];
}

export interface Attachment {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedBy: string;
    uploadedAt: Date;
    _id: string;
}

export interface MemberProps {
    _id: string;
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: Date;
}

export type ResourceType =
    | "Task"
    | "Project"
    | "Workspace"
    | "Comment"
    | "User";

export type ActionType =
    | "created_task"
    | "updated_task"
    | "created_subtask"
    | "updated_subtask"
    | "completed_task"
    | "created_project"
    | "updated_project"
    | "completed_project"
    | "created_workspace"
    | "updated_workspace"
    | "added_comment"
    | "added_member"
    | "removed_member"
    | "joined_workspace"
    | "added_attachment";

export interface ActivityLog {
    _id: string;
    user: User;
    action: ActionType;
    resourceType: ResourceType;
    resourceId: string;
    details: any;
    createdAt: Date;
}

export interface CommentReaction {
    emoji: string;
    user: User;
}

export interface Comment {
    _id: string;
    author: User;
    text: string;
    createdAt: Date;
    reactions?: CommentReaction[];
    attachments?: {
        fileName: string;
        fileUrl: string;
        fileType?: string;
        fileSize?: number;
    }[];
}

export interface StatsCardProps {
    totalProjects: number;
    totalTasks: number;
    totalProjectInProgress: number;
    totalTaskCompleted: number;
    totalTaskToDo: number;
    totalTaskInProgress: number;
}

export interface TaskTrendsData {
    name: string;
    completed: number;
    inProgress: number;
    todo: number;
}

export interface TaskPriorityData {
    name: string;
    value: number;
    color: string;
}

export interface ProjectStatusData {
    name: string;
    value: number;
    color: string;
}

export interface WorkspaceProductivityData {
    name: string;
    completed: number;
    total: number;
}

