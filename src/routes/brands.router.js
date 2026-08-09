import { Router } from "express"
import * as brandsController from "../controllers/brands.controller.js"

const brandRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Product brand management
 */

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: List of all brands
 */
brandRouter.get("/", brandsController.getAll)

/**
 * @swagger
 * /brands/{id}:
 *   get:
 *     summary: Get brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand data
 *       404:
 *         description: Brand not found
 */
brandRouter.get("/:id", brandsController.getById)

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nike
 *     responses:
 *       201:
 *         description: Brand created successfully
 *       400:
 *         description: Invalid input data
 */
brandRouter.post('/', brandsController.create)

/**
 * @swagger
 * /brands/{id}:
 *   delete:
 *     summary: Delete brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *       404:
 *         description: Brand not found
 */
brandRouter.delete("/:id", brandsController.remove)

/**
 * @swagger
 * /brands/{id}:
 *   patch:
 *     summary: Update brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Brand ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Adidas
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *       404:
 *         description: Brand not found
 */
brandRouter.patch("/:id", brandsController.edit)

export default brandRouter;
