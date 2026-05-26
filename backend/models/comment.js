import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true, },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true, },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    mentions: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
        offset: { type: Number, required: true, min: 0, },
        length: { type: Number, required: true, min: 0, },
    }],
    reactions: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
        reaction: { type: String, enum: ["like", "love", "haha", "wow", "sad", "angry"], default: "like", },
    }],
    attachments: [{
        fileName: { type: String, required: true, trim: true, },
        fileUrl: { type: String, required: true, trim: true, },
        fileType: { type: String, required: true, trim: true, },
        fileSize: { type: Number, required: true, min: 0 },
        uploadedAt: { type: Date, default: Date.now},
    }],
    isEdited: { type: Boolean, default: false, },
    editedAt: { type: Date, },

    
    
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;