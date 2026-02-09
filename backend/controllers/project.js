import Project from "../models/project.js";
import Workspace from "../models/workspace.js";
import Task from "../models/task.js";

export const createProjectController = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { title, description, status, startDate, dueDate, progress, members, tags } = req.body;

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const isMember = workspace.members.some(
            (member) => member.user._id.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this workspace" });
        }

        const tagArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

        const project = await Project.create({
            title, description,
            status, startDate, dueDate,
            progress, members, tags: tagArray,
            workspace: workspaceId,
            createdBy: req.user.id,
        });

        workspace.projects.push(project._id);
        await workspace.save();

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getProjectDetailsController = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isMember = project.members.some(
            (member) => member.user._id.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this project" });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getProjectTasksController = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId).populate("members.user");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isMember = project.members.some(
            (member) => member.user?._id.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this project" });
        }

        const tasks = await Task.find({ project: projectId, isArchived: false })
            .populate("assignees", "name profilePicture")
            .sort({ createdAt: -1 });


        res.status(200).json({ project, tasks });
    } catch (error) {
        console.log("Error in getProjectTasksController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
