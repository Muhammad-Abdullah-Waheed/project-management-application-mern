import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, },
    description: { type: String, trim: true, },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, },
    status: { type: String, enum: ["To-Do", "In-Progress", "Review", "Done", "Cancelled"], default: "To-Do", },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium", },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", }],
    watchers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", }],
    dueDate: { type: Date, required: true, },
    completedAt: { type: Date, },
    estimatedHours: { type: Number, default: 0, min: 0 },
    actualHours: { type: Number, default: 0, min: 0 },
    tags: [{ type: String, trim: true, }],
    subtasks: [{
        title: { type: String, required: true, trim: true, },
        discription: { type: String, trim: true, },
        completed: { type: Boolean, default: false, },
        completedAt: { type: Date, default: Date.now},
    }],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
    attachment:[{
        fileName: { type: String, required: true, trim: true, },
        fileUrl: { type: String, required: true, trim: true, },
        fileType: { type: String, required: true, trim: true, },
        fileSize: { type: Number, required: true, min: 0 },
        uploadedAt: { type: Date, default: Date.now},
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    isArchived: { type: Boolean, default: false, },
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

export default Task;