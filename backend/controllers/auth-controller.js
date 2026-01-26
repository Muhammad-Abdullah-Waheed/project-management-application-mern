import User from "../models/user.js";
import Verification from "../models/verification.js";
import { emailQueue } from "../libs/email-queue.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import aj from "../libs/arcjet.js";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const decision = await aj.protect(req, {
            email: req.body.email,
        });
        console.log("Arcjet decision", decision);


        if (decision.isDenied()) {
            return res.status(403).json({
                message: "Invalid email address for registration",
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "This email is not allowed please use any other email for registration." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ name, email, password: hashedPassword });

        // Generate JWT Token for Verification
        const verificationToken = jwt.sign(
            { userId: newUser._id, purpose: "Email-Verification" },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Store Token in Verification Collection
        await Verification.create({
            userId: newUser._id,
            token: verificationToken,
        });

        // Add email job to queue
        await emailQueue.add('send-verification', {
            email: newUser.email,
            token: verificationToken,
        });

        res.status(201).json({ message: "Verification email is sent to your email account. Please check and verify your email." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        // Verify JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: "Invalid token" });
        }

        // Find Verification Record
        const verificationRecord = await Verification.findOne({
            userId: decoded.userId,
            token: token,
        });

        if (!verificationRecord || decoded.purpose !== "Email-Verification") {
            return res.status(400).json({ message: "Unauthorized access for verification 1" });
        }

        // Update User
        await User.findByIdAndUpdate(decoded.userId, { isEmailVerified: true });

        // Delete Verification Record ("Token is gone")
        // await Verification.findByIdAndDelete(verificationRecord._id);

        res.status(200).json({ message: "Email verified successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.isEmailVerified) {
            const verificationRecord = await Verification.findOne({
                userId: user._id,
            });
            if (verificationRecord) {
                return res.status(401).json({ message: "Please verify your email address" });
            } else {
                const token = jwt.sign(
                    { userId: user._id, purpose: "Email-Verification" },
                    process.env.JWT_SECRET,
                    { expiresIn: '1d' }
                );

                await Verification.create({
                    userId: user._id,
                    token,
                });

                await emailQueue.add('send-verification', {
                    email: user.email,
                    token,
                });
                return res.status(200).json({ message: "Verification email is sent to your email account. Please check and verify your email." });
            }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        user.lastLogin = new Date();
        await user.save();
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        delete userWithoutPassword.isEmailVerified;
        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, purpose: "Login" },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.status(200).json({ message: "Login successful", token, user: userWithoutPassword, });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isEmailVerified) {
            return res.status(401).json({ message: "Please verify your email address" });
        }

        const verificationRecord = await Verification.findOne({
            userId: user._id,
        });

        if (verificationRecord) {
            return res.status(401).json({ message: "Email for password reset is already sent to your email account. Please check and reset your password." });
        }

        const token = jwt.sign(
            { userId: user._id, purpose: "Password-Reset" },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        await Verification.create({
            userId: user._id,
            token,
        });

        await emailQueue.add('send-password-reset', {
            email: user.email,
            token,
        });

        res.status(200).json({ message: "Password reset email is sent to your email account. Please check and reset your password." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { password, token } = req.body;

        if (!password || !token) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.purpose !== "Password-Reset") {
            return res.status(401).json({ message: "Unauthorized access for password reset" });
        }

        const user = await User.findOne({ _id: decoded.userId }).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isEmailVerified) {
            return res.status(401).json({ message: "Please verify your email address" });
        }

        const verificationRecord = await Verification.findOne({
            userId: user._id,
        });

        if (!verificationRecord || verificationRecord.token !== token) {
            return res.status(401).json({ message: "Unauthorized access for password reset" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            return res.status(400).json({ message: "New password cannot be same as old password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save();

        await Verification.findByIdAndDelete(verificationRecord._id);

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export { registerUser, loginUser, verifyEmail, resetPasswordRequest, resetPassword };
