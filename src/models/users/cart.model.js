import { pool } from "../../config/postgres.js";

export async function create(user_id, product_id, quantity) { 
  const { rows } = await pool.query(
    `INSERT INTO user_carts (user_id, product_id, quantity, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING * `, [user_id, product_id, quantity]
  )
  return rows[0];
}