import pg from "pg" 

const { Pool } = pg; 

export const pool = new Pool({ 
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || "5432", 
  user: process.env.DB_USER || "postgres", 
  password: process.env.DB_PASSWORD || "admin", 
  database: process.env.DB_NAME || "belimudah",
  max: 5,
  min: 0,
  idleTimeoutMillis: 10000, 
  connectionTimeoutMillis: 30000
})

pool.on("error", (error) => { 
  console.error("Unexpeceted DB error", error)
})