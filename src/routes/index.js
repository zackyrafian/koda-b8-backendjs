import { Router } from "express"
import authRouter from "./auth.router.js"
import brandRouter from "./brands.router.js"


const router = Router() 
router.use("/auth", authRouter)
router.use("/brands", brandRouter)
export default router