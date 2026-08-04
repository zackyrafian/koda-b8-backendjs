import * as userController from "../controllers/users/profiles.controller.js"
import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";

const usersRouter = Router()
usersRouter.get("/profile", authMiddleware ,userController.getUserProfile)

export default usersRouter