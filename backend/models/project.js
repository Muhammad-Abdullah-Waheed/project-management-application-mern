import mongoose from "mongoose";


const projectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, },
    description: { type: String, trim: true, },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true, },
    status: { type: String, enum: ["Planing", "In Progress", "On Hold", "Completed", "Cancelled"], default: "Planing", },
    startDate: { type: Date, required: true, },
    dueDate: { type: Date, required: true, },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    members: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
            role: { type: String, enum: ["manager", "contributor", "viewer"], default: "contributor", },
            joinAt: { type: Date, default: Date.now, },
        },
    ],
    tags: [{ type: String, trim: true, }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    isArchived: { type: Boolean, default: false, },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;