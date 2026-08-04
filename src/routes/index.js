import { Router } from "express"
import authRouter from "./auth.router.js"
import brandRouter from "./brands.router.js"
import categoriesRouter from "./categories.router.js"
import usersRouter from "./users.router.js"


const router = Router() 
router.use("/auth", authRouter)
router.use("/brands", brandRouter)
router.use("/categories", categoriesRouter)
router.use('/users', usersRouter)
export default router