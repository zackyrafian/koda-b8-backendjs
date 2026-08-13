import * as userProfileController from "../controllers/users/profiles.controller.js"
import * as userCartController from "../controllers/users/cart.controller.js"
import * as userOrdersController from "../controllers/users/orders.controller.js"
import * as userAddressController from "../controllers/users/address.controller.js"
import * as userInformationController from "../controllers/users/users.controller.js"
import * as userWishListsController from "../controllers/users/wishlists.controller.js"
import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { uploadMiddleware } from "../middleware/upload.middleware.js";

const usersRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile, cart, orders, and address management
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 */
usersRouter.get("/profile", authMiddleware, userProfileController.getUserProfile)

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update user profile picture
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               picture:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *       401:
 *         description: Unauthorized
 */
usersRouter.patch("/profile", uploadMiddleware("picture"), authMiddleware, userProfileController.profileImage)

/**
 * @swagger
 * /users/cart:
 *   post:
 *     summary: Add product to cart
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added to cart successfully
 *       401:
 *         description: Unauthorized
 */
usersRouter.post("/cart", authMiddleware, userCartController.create)

/**
 * @swagger
 * /users/cart:
 *   get:
 *     summary: Get all items in user cart
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cart items
 *       401:
 *         description: Unauthorized
 */
usersRouter.get("/cart", authMiddleware, userCartController.getAll)

/**
 * @swagger
 * /users/cart/{id}:
 *   patch:
 *     summary: Update cart item quantity
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 */
usersRouter.patch("/cart/:id", authMiddleware, userCartController.updateQuantity)

/**
 * @swagger
 * /users/cart/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 */
usersRouter.delete("/cart/:id", authMiddleware, userCartController.remove)

/**
 * @swagger
 * /users/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address_id
 *             properties:
 *               address_id:
 *                 type: integer
 *                 example: 1
 *               notes:
 *                 type: string
 *                 example: Please pack carefully
 *     responses:
 *       201:
 *         description: Order created successfully
 *       401:
 *         description: Unauthorized
 */
usersRouter.post("/orders", authMiddleware, userOrdersController.create)

/**
 * @swagger
 * /users/orders:
 *   get:
 *     summary: Get all user orders
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Unauthorized
 */
usersRouter.get("/orders", authMiddleware, userOrdersController.getAll)

/**
 * @swagger
 * /users/orders/{id}:
 *   get:
 *     summary: Get order detail by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order detail
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
usersRouter.get("/orders/:id", authMiddleware, userOrdersController.getOne)

/**
 * @swagger
 * /users/address:
 *   post:
 *     summary: Add a new address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - city
 *               - province
 *               - postal_code
 *             properties:
 *               street:
 *                 type: string
 *                 example: 10 Sudirman St.
 *               city:
 *                 type: string
 *                 example: Jakarta
 *               province:
 *                 type: string
 *                 example: DKI Jakarta
 *               postal_code:
 *                 type: string
 *                 example: "12190"
 *     responses:
 *       201:
 *         description: Address added successfully
 *       401:
 *         description: Unauthorized
 */
usersRouter.post("/address", authMiddleware, userAddressController.create)

/**
 * @swagger
 * /users/address:
 *   get:
 *     summary: Get all user addresses
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all addresses
 *       401:
 *         description: Unauthorized
 */
usersRouter.get("/address", authMiddleware, userAddressController.getAll)

/**
 * @swagger
 * /users/address/{id}:
 *   get:
 *     summary: Get address by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
usersRouter.get("/address/:id", authMiddleware, userAddressController.getById)

/**
 * @swagger
 * /users/address/{id}:
 *   get:
 *     summary: Get address by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
usersRouter.delete("/address/:id", authMiddleware, userAddressController.remove)

/**
 * @swagger
 * /users/info:
 *   get:
 *     summary: Get user account information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 *       401:
 *         description: Unauthorized
 */
usersRouter.get("/info", authMiddleware, userInformationController.getUserInfo)

usersRouter.get("/wishlist", authMiddleware, userWishListsController.getAll)
usersRouter.post("/wishlist", authMiddleware, userWishListsController.create)

export default usersRouter
