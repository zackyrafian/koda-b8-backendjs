import { Router } from "express"
import authRouter from "./auth.router.js"
import brandRouter from "./brands.router.js"
import categoriesRouter from "./categories.router.js"


const router = Router() 
router.use("/auth", authRouter)
router.use("/brands", brandRouter)
router.use("/categories", categoriesRouter)
export default router