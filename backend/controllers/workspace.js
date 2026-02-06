import Workspace from "../models/workspace.js";
import Project from "../models/project.js";

const createWorkspace = async (req, res) => {
    try {
        const { name, description, color } = req.body;
        const workspace = await Workspace.create(
            {
                name,
                description,
                color,
                owner: req.user._id,
                members: [{ user: req.user._id, role: "owner" }]
            });
        res.status(201).json({ message: "Workspace created successfully", workspace });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await Workspace.find({ members: { $elemMatch: { user: req.user._id } } }).sort({ createdAt: -1 });
        res.status(200).json({ message: "Workspaces fetched successfully", workspaces });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getWorkspaceDetails = async (req, res) => {
    try {
        const workspace = await Workspace.findOne(req.params.workspaceId).populate("members.user", "name email profilePicture");
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        res.status(200).json({ message: "Workspace details fetched successfully", workspace });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getWorkspaceProjects = async (req, res) => {
    try {
        const workspace = await Workspace.findOne({ _id: req.params.workspaceId }).populate(
            "members.user", "name email profilePicture",
        );
        if (!workspace) {
            res.status(404).json({ message: "Workspace not found" });
        }
        const projects = await Project.find({
            workspace: req.params.workspaceId,
            isArchived: false,
            // members: { $in: { user: req.user._id } },
        })
            // .populate("tasks", "status")
            .sort({ createdAt: -1 });
        if (!projects) {
            res.status(404).json({ message: "Projects not found" });
        }
        res.status(200).json({ message: "Projects fetched successfully", projects, workspace: workspace });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { createWorkspace, getWorkspaces, getWorkspaceDetails, getWorkspaceProjects };