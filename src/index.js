import express from "express" 
import { createServer } from "node:http"
import { Server } from "socket.io"
import morgan from "morgan";
import router from "./routes/index.js";
import { pool } from "./config/postgres.js";
import 'dotenv/config'
import corsMiddleware from "./middleware/cors.middleware.js";
import { createRequire } from "module";
import swaggerSpec from "./config/swagger.js";
import db from './models/index.js'

const { User } = db


const require = createRequire(import.meta.url);
const swaggerUi = require("swagger-ui-express");


const app = express(); 
const socket = createServer(app); 
const io = new Server(socket, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on('connection', (client) => { 
  console.log(client.id)

  client.on("disconnect", () => { 
    console.log(client.id)
  })
})

app.set("io", io);
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
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(router)


const PORT = 2222; 
socket.listen(PORT, () => { 
  console.log(`Server Running PORT ${PORT}`)
})