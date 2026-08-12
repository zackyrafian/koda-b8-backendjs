import { pool } from "../../config/postgres.js";

export async function create(user_id, product_id, quantity, variant) { 
  if (variant !== undefined && variant !== null) {
    const variantResult = await pool.query(
      `SELECT 1 FROM product_variants WHERE product_id = $1 AND name = $2`,
      [product_id, variant]
    )
    if (variantResult.rowCount === 0) {
      throw new Error("Variant does not belong to this product")
    }
  }
  const { rows } = await pool.query(
    `INSERT INTO user_carts (user_id, product_id,  variant, quantity, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING * `, [user_id, product_id, variant, quantity]
  )
  return rows[0];
}

export async function findAll(user_id) { 
  const { rows } = await pool.query(
    `SELECT 
      uc.id,
      uc.user_id,
      uc.product_id,
      uc.quantity,
      uc.created_at,
      uc.updated_at,
      p.name,
      p.price,
      COALESCE(
        (SELECT json_agg(pi.url ORDER BY pi.id)
         FROM product_images pi
         WHERE pi.product_id = p.id),
        '[]'
      ) AS images,
       uc.variant
    FROM user_carts AS uc
    JOIN products AS p ON uc.product_id = p.id
    WHERE uc.user_id = $1
    ORDER BY uc.created_at DESC`,
    [user_id]
  )
  return rows;
}

export async function findById(cart_id, user_id) { 
  const { rows } = await pool.query(
    `SELECT uc.id, uc.user_id, uc.product_id, uc.variant, uc.quantity, p.price 
    FROM user_carts uc
    JOIN products p ON uc.product_id = p.id
    WHERE uc.id = ANY($1) AND uc.user_id = $2`,
    [cart_id, user_id]
  )
  return rows;
}

export async function updateQuantity(cart_id, user_id, quantity) {
  const { rows } = await pool.query(
    `UPDATE user_carts SET quantity = $1, updated_at = NOW()
     WHERE id = $2 AND user_id = $3
     RETURNING *`,
    [quantity, cart_id, user_id]
  )
  return rows[0];
}

export async function deleteById(cart_id, user_id) { 
  const { rows } = await pool.query(
    `DELETE FROM user_carts WHERE id = ANY($1) AND user_id = $2 RETURNING *`,
    [cart_id, user_id]
  )
  return rows;
}
