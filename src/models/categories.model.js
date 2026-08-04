import { pool } from "../config/postgres.js";

export async function findAll() {
  const { rows } = await pool.query(
    `SELECT id, name FROM categories` 
  )
  return rows;
}