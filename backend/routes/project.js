import express from "express";
import { validateRequest } from "zod-express-middleware";
import { projectSchema } from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { createProjectController, getProjectTasksController, getProjectDetailsController } from "../controllers/project.js";
import z from "zod";


const router = express.Router();

router.post("/:workspaceId/create-project",
    authMiddleware,
    validateRequest({
        params: z.object({ workspaceId: z.string() }),
        body: projectSchema
    }),
    createProjectController)

router.get("/:projectId", authMiddleware, validateRequest({
    params: z.object({ projectId: z.string() }),
}), getProjectDetailsController)

router.get("/:projectId/tasks", authMiddleware, validateRequest({
    params: z.object({ projectId: z.string() }),
}), getProjectTasksController)



export default router;
