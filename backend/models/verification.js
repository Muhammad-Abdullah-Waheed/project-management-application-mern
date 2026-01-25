import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String, // This will store the JWT
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // Automatically delete after 24 hours (TTL)
    },
}, {
    timestamps: true,
});

const Verification = mongoose.model("Verification", verificationSchema);

export default Verification;
