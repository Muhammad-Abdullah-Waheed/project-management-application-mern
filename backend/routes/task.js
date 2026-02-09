import express from "express";

import { z } from "zod";
import { createTaskSchema } from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { validateRequest } from "zod-express-middleware";
import { createTaskHandler } from "../controllers/task.js";

const router = express.Router();

router.post("/:projectId/create-task",
    authMiddleware,
    validateRequest({
        params: z.object({ projectId: z.string() }),
        body: createTaskSchema,
    }),
    createTaskHandler,
);

export default router;
