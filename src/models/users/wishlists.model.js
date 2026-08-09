import { pool } from "../../config/postgres.js";

export async function create(user_id, product_id) { 
  const { rows } = await pool.query(
    `INSERT INTO user_wishlists (user_id, product_id, created_at) VALUES ($1, $2, NOW()) RETURNING * `, [user_id, product_id]
  )
  return rows[0];
}

export async function findAll(user_id) { 
  const { rows } = await pool.query(
    `SELECT uc.id, uc.user_id, uc.product_id, uc.created_at, json_build_object(
    'id', p.id,
    'name', p.name,
    'price', p.price
    ) as product FROM user_wishlists as uc
    JOIN products as p ON uc.product_id = p.id
    WHERE user_id = $1 ORDER BY uc.created_at DESC`, [user_id]
  )
  return rows;
}

export async function findById(cart_id, user_id) { 
  const { rows } = await pool.query(
    `SELECT uc.id, uc.user_id, uc.product_id, uc.quantity, p.price 
    FROM user_wishlists uc
    JOIN products p ON uc.product_id = p.id
    WHERE uc.id = ANY($1) AND uc.user_id = $2`,
    [cart_id, user_id]
  )
  return rows;
}

export async function deleteById(cart_id, user_id) { 
  const { rows } = await pool.query(
    `DELETE FROM user_wishlists WHERE id = ANY($1) AND user_id = $2 RETURNING *`,
    [cart_id, user_id]
  )
  return rows;
}