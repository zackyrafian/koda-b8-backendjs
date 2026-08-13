import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import * as  adminOrdersController from "../controllers/admin/orders.controller.js"

const adminRouter = Router(); 

adminRouter.patch('/orders/:id/status', authMiddleware, adminOrdersController.update)

export default adminRouter;