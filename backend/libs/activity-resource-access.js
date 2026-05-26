import Comment from "../models/comment.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import Workspace from "../models/workspace.js";
import { isProjectMember, isWorkspaceMember } from "./access.js";

/**
 * Ensures the user may view activity logs for this resource (task / project / workspace / comment).
 */
export async function assertActivityResourceAccess(req, resourceId) {
    const task = await Task.findById(resourceId);
    if (task) {
        const project = await Project.findById(task.project);
        if (!project) {
            return { allowed: false, status: 404, message: "Resource not found" };
        }
        if (!isProjectMember(project, req.user._id)) {
            return {
                allowed: false,
                status: 403,
                message: "You are not a member of this project",
            };
        }
        return { allowed: true };
    }

    const project = await Project.findById(resourceId);
    if (project) {
        if (!isProjectMember(project, req.user._id)) {
            return {
                allowed: false,
                status: 403,
                message: "You are not a member of this project",
            };
        }
        return { allowed: true };
    }

    const workspace = await Workspace.findById(resourceId);
    if (workspace) {
        if (!isWorkspaceMember(workspace, req.user._id)) {
            return {
                allowed: false,
                status: 403,
                message: "You are not a member of this workspace",
            };
        }
        return { allowed: true };
    }

    const comment = await Comment.findById(resourceId);
    if (comment) {
        const t = await Task.findById(comment.task);
        if (!t) {
            return { allowed: false, status: 404, message: "Resource not found" };
        }
        const p = await Project.findById(t.project);
        if (!p) {
            return { allowed: false, status: 404, message: "Resource not found" };
        }
        if (!isProjectMember(p, req.user._id)) {
            return {
                allowed: false,
                status: 403,
                message: "You are not a member of this project",
            };
        }
        return { allowed: true };
    }

    return { allowed: false, status: 404, message: "Resource not found" };
}
