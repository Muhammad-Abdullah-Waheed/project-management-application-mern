import mongoose from "mongoose";


const workspaceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, },
    description: { type: String, trim: true, },
    color: { type: String, default: "#FF5733", },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    members: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
            role: { type: String, enum: ["owner", "admin", "member", "viewer"], default: "member", },
            joinAt: { type: Date, default: Date.now, },
        },
    ],
    projects: [{ project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, }],
}, { timestamps: true });

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;