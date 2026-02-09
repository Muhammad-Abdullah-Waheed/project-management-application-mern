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

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    project: Project;
    assignees: User[];
    assignee: User;
    watchers: User[];
    dueDate: Date;
    completedAt?: Date;
    estimatedHours: number;
    actualHours: number;
    tags: string[];
    createdBy: User;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
    priority: TaskPriority;
    subtasks: Subtask[];
    attachments: Attachment[];

}

export interface Subtask {
    _id: string;
    title: string;
    description?: string;
    completed: boolean;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Attachment {
    _id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedAt: Date;
    uploadedBy: User | string;
}

export interface Comment {
    _id: string;
    text: string;
    task: Task;
    author: User;
    mentions: { user: User | string; offset: number; length: number; }[];
    reactions: { user: User | string; reaction: "like" | "love" | "haha" | "wow" | "sad" | "angry"; }[];
    attachments: Attachment[];
    isEdited: boolean;
    editedAt?: Date;
}

export interface MemberProps {
    user: User;
    role: "owner" | "admin" | "member" | "viewer";
    joinDate: Date;
}

export enum ProjectMemberRole {
    OWNER = "manager",
    ADMIN = "contributor",
    MEMBER = "viewer",
}
