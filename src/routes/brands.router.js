import { Router } from "express"
import * as brandsController from "../controllers/brands.controller.js"


const brandRouter = Router();
brandRouter.get("/", brandsController.getAll)
brandRouter.get("/:id", brandsController.getById)
export default brandRouter;