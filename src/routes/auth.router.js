import { Router } from "express";
import * as authController from "../controllers/auth.controller.js"
const authRouter = Router();
authRouter.post("/register", authController.register)
authRouter.post("/login", authController.loign)

export default authRouter;