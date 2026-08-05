import * as userProfileController from "../controllers/users/profiles.controller.js"
import * as userCartController from "../controllers/users/cart.controller.js"
import * as userOrdersController from "../controllers/users/orders.controller.js"
import * as userAddressController from "../controllers/users/address.controller.js"
import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import uploadMiddleware from "../middleware/upload.middleware.js";

const usersRouter = Router()
usersRouter.get("/profile", authMiddleware, userProfileController.getUserProfile)
usersRouter.patch("/profile/picture", uploadMiddleware("picture"), authMiddleware, userProfileController.profileImage)

usersRouter.post("/cart", authMiddleware, userCartController.create)
usersRouter.get("/cart", authMiddleware, userCartController.getAll)
usersRouter.patch("/cart/:id", authMiddleware, userCartController.updateQuantity)
usersRouter.delete("/cart/:id", authMiddleware, userCartController.remove)

usersRouter.post("/orders", authMiddleware, userOrdersController.create)
usersRouter.get("/orders", authMiddleware, userOrdersController.getAll)
usersRouter.get("/orders/:id", authMiddleware, userOrdersController.getOne)

usersRouter.post("/address", authMiddleware, userAddressController.create)
usersRouter.get("/address", authMiddleware, userAddressController.getAll)
usersRouter.get("/address/:id", authMiddleware, userAddressController.getById)

export default usersRouter