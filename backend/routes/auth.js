import express from "express";
import { validateRequest } from "zod-express-middleware";
import { registerSchema, loginSchema, verifyEmailSchema, resetPasswordRequestSchema, resetPasswordSchema } from "../libs/validate-schema.js";
import { registerUser, loginUser, verifyEmail, resetPasswordRequest, resetPassword } from "../controllers/auth-controller.js";
import { authRouteLimiter } from "../middleware/rate-limit.js";


const router = express.Router();

router.post('/register', authRouteLimiter, validateRequest({ body: registerSchema }), registerUser);
router.post('/login', authRouteLimiter, validateRequest({ body: loginSchema }), loginUser);
router.post('/verify-email', authRouteLimiter, validateRequest({ body: verifyEmailSchema }), verifyEmail);
router.post('/reset-password-request', authRouteLimiter, validateRequest({ body: resetPasswordRequestSchema }), resetPasswordRequest);
router.post('/reset-password', authRouteLimiter, validateRequest({ body: resetPasswordSchema }), resetPassword);

export default router;