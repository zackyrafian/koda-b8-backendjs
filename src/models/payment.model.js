import { pool } from "../config/postgres.js"

export async function findAll() { 
  const { rows } = await pool.query(
    `SELECT * FROM payment_methods`
  )
  return rows;
}

export async function findMethodById(id) { 
  const { rows } = await pool.query(
    `SELECT * FROM payment_methods WHERE id = $1 AND is_active = true`, [id]
  )
  return rows[0] ?? null;
}

export async function create({ order_id, payment_method_id, va_number, amount, admin_fee, total_amount, expired_at }) { 
  const { rows } = await pool.query(
    `INSERT INTO payments (order_id, payment_method_id, va_number, amount, admin_fee, total_amount, expired_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [order_id, payment_method_id, va_number, amount, admin_fee, total_amount, expired_at]
  )
  return rows[0]
}