import express from "express";
import { validateRequest } from "zod-express-middleware";
import { registerSchema, loginSchema, verifyEmailSchema, resetPasswordRequestSchema, resetPasswordSchema } from "../libs/validate-schema.js";
import { registerUser, loginUser, verifyEmail, resetPasswordRequest, resetPassword } from "../controllers/auth-controller.js";


const router = express.Router();

router.post('/register', validateRequest({ body: registerSchema }), registerUser);
router.post('/login', validateRequest({ body: loginSchema }), loginUser);
router.post('/verify-email', validateRequest({ body: verifyEmailSchema }), verifyEmail);
router.post('/reset-password-request', validateRequest({ body: resetPasswordRequestSchema }), resetPasswordRequest);
router.post('/reset-password', validateRequest({ body: resetPasswordSchema }), resetPassword);

export default router;