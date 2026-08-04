import express from "express" 
import router from "./routes/index.js";
import corsMiddleware from "./middleware/cors.middleware.js";
const app = express(); 

app.get("/ping", (req, res) => { 
  res.status(200).json({ 
    "success": true,
    "message": "Pong"
  })
})
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
app.use(corsMiddleware)
app.use(router)


const PORT = 2222; 
app.listen(PORT, () => { 
  console.log(`Server Running PORT ${PORT}`)
})