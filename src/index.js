import express from "express" 
import morgan from "morgan";
import router from "./routes/index.js";
import { pool } from "./config/postgres.js";
import 'dotenv/config'
import corsMiddleware from "./middleware/cors.middleware.js";
const app = express(); 

app.get("/ping", (req, res) => { 
  res.status(200).json({ 
    "success": true,
    "message": "Pong"
  })
})

try {
  await pool.query('SELECT NOW()');
  console.log('Database connected successfully.');
} catch (error) {
  console.error('Database connection failed:', error);
  // eslint-disable-next-line no-undef
  process.exit(1);
}

app.use(
  morgan("[:date[iso]] :remote-addr :method :url :status :response-time ms"),
);


console.log(process.env.CLIENT_URL)
app.use('/images', express.static('images'))
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
app.use(corsMiddleware)
app.use(router)


const PORT = 2222; 
app.listen(PORT, () => { 
  console.log(`Server Running PORT ${PORT}`)
})