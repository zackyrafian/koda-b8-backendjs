import { Router } from "express"
import * as productsController from "../controllers/products.controller.js"

const productsRouter = Router()
productsRouter.get('/', productsController.getAll)
productsRouter.get('/:id', productsController.getById)

export default productsRouter;