import { Router } from "express";
import * as paymentController from "../controllers/payment.controller.js"
import authMiddleware from "../middleware/auth.middleware.js";

const paymentRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all payments
 *       401:
 *         description: Unauthorized
 */
paymentRouter.get('/', authMiddleware, paymentController.getAll)

export default paymentRouter;
