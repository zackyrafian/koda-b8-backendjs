import * as categoriesController from "../controllers/categories.controller.js"
import { Router } from "express";

const categoriesRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Product category management
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 */
categoriesRouter.get("/", categoriesController.getAll)

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category data
 *       404:
 *         description: Category not found
 */
categoriesRouter.get('/:id', categoriesController.getById)

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input data
 */
categoriesRouter.post('/', categoriesController.create)

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
categoriesRouter.delete('/:id', categoriesController.remove)

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Clothing
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
categoriesRouter.patch('/:id', categoriesController.update)

export default categoriesRouter
