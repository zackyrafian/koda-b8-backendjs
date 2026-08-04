import * as categoriesController from "../controllers/categories.controller.js"
import { Router } from "express";

const categoriesRouter = Router()

categoriesRouter.get("/", categoriesController.getAll)
categoriesRouter.get('/:id', categoriesController.getById)
categoriesRouter.post('/', categoriesController.create)
categoriesRouter.delete('/:id', categoriesController.remove)
categoriesRouter.patch('/:id', categoriesController.update)
export default categoriesRouter