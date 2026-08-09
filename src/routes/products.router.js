import { Router } from "express"
import * as productsController from "../controllers/products.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"
import isAdmin from "../middleware/isAdmin.middleware.js"

const productsRouter = Router()
productsRouter.get('/', productsController.getAll)
productsRouter.get('/:id', productsController.getById)
productsRouter.post('/', authMiddleware, isAdmin, productsController.create)
productsRouter.delete('/:id', authMiddleware, isAdmin, productsController.remove)

export default productsRouter;