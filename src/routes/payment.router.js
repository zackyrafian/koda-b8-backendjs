import { Router } from "express";
import * as paymentController from "../controllers/payment.controller.js"
import authMiddleware from "../middleware/auth.middleware.js";

const paymentRouter = Router();
paymentRouter.get('/',authMiddleware, paymentController.getAll)

export default paymentRouter;