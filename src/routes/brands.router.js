import { Router } from "express"
import * as brandsController from "../controllers/brands.controller.js"


const brandRouter = Router();
brandRouter.get("/", brandsController.getAll)

export default brandRouter;