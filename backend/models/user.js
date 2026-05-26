import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 40,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    profilePicture: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
    },
    is2FAEnabled: {
        type: Boolean,
        default: false,
    },
    twoFactorOTP: {
        type: String,
        select: false,
    },
    twofactorExpiry: {
        type: Date,
        select: false,
    },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;    