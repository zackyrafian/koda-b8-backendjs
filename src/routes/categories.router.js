import * as categoriesController from "../controllers/categories.controller.js"
import { Router } from "express";

const categoriesRouter = Router()

categoriesRouter.get("/", categoriesController.getAll)
categoriesRouter.get('/:id', categoriesController.getById)
categoriesRouter.post('/', categoriesController.create)
categoriesRouter.delete('/:id', categoriesController.remove)
export default categoriesRouter