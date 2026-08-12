import { Router } from "express"
import * as productsController from "../controllers/products.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"
import isAdmin from "../middleware/isAdmin.middleware.js"
import { uploadMultipleMiddleware } from "../middleware/upload.middleware.js"

const productsRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */
productsRouter.get('/', productsController.getAll)

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product data
 *       404:
 *         description: Product not found
 */
productsRouter.get('/:id', productsController.getById)

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nike Air Max
 *               price:
 *                 type: number
 *                 example: 1500000
 *               stock:
 *                 type: integer
 *                 example: 50
 *               description:
 *                 type: string
 *                 example: High quality running shoes
 *               brand_id:
 *                 type: integer
 *                 example: 1
 *               category_id:
 *                 type: integer
 *                 example: 2
 *               variant:
 *                 type: string
 *                 example: Hitam, Putih, Biru
 *                 description: Variant dipisahkan dengan koma
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 */
productsRouter.post('/', authMiddleware, isAdmin, productsController.create)

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product by ID (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Product not found
 */
productsRouter.delete('/:id', authMiddleware, isAdmin, productsController.remove)

/**
 * @swagger
 * /products/{id}/images:
 *   post:
 *     summary: Upload images for a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Images uploaded successfully
 *       400:
 *         description: No images uploaded or invalid file type
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Product not found
 */
productsRouter.post('/:id/images', authMiddleware, isAdmin, uploadMultipleMiddleware('images'), productsController.uploadImages)

export default productsRouter;
