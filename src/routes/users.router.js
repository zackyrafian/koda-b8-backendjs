import * as userProfileController from "../controllers/users/profiles.controller.js"
import * as userCartController from "../controllers/users/cart.controller.js"
import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import uploadMiddleware from "../middleware/upload.middleware.js";

const usersRouter = Router()
usersRouter.get("/profile", authMiddleware, userProfileController.getUserProfile)
usersRouter.patch("/profile/picture", uploadMiddleware("picture"), authMiddleware, userProfileController.profileImage)

usersRouter.post("/cart", authMiddleware, userCartController.create)

export default usersRouter