import Project from "../models/project.js";
import Workspace from "../models/workspace.js";

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