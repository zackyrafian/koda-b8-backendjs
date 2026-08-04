import * as categoriesController from "../controllers/categories.controller.js"
import { Router } from "express";

const categoriesRouter = Router()

categoriesRouter.get("/", categoriesController.getAll)
categoriesRouter.get('/:id', categoriesController.getById)

export default categoriesRouter