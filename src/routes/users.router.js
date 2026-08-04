import * as userController from "../controllers/users/profiles.controller.js"
import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import uploadMiddleware from "../middleware/upload.middleware.js";

const usersRouter = Router()
usersRouter.get("/profile", authMiddleware, userController.getUserProfile)
usersRouter.patch("/profile/picture", uploadMiddleware, authMiddleware, userController.profileImage)

export default usersRouter