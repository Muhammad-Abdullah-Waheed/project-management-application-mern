import express from "express";
import authenticateUser from "../middleware/auth-middleware.js";
import upload from "../middleware/upload.js";
import {
    changePassword,
    getUserProfile,
    updateUserProfile,
} from "../controllers/user.js";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";

const router = express.Router();

router.get("/profile", authenticateUser, getUserProfile);
router.put(
    "/profile",
    authenticateUser,
    validateRequest({
        body: z.object({
            name: z.string(),
            profilePicture: z.string().optional(),
        }),
    }),
    updateUserProfile
);

router.put(
    "/change-password",
    authenticateUser,
    validateRequest({
        body: z.object({
            currentPassword: z.string(),
            newPassword: z.string(),
            confirmPassword: z.string(),
        }),
    }),
    changePassword
);

// Upload avatar endpoint
router.post("/upload-avatar", authenticateUser, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Generate URL for the uploaded file
        const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/avatars/${req.file.filename}`;

        res.status(200).json({
            message: "Avatar uploaded successfully",
            url: fileUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error("Avatar upload error:", error);
        res.status(500).json({ error: error.message || "Failed to upload avatar" });
    }
});

export default router;
