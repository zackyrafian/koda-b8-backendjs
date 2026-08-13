import { pool } from "../../config/postgres.js"

export async function create(productId, userId, { variant_id, rating, comment }) {
  const { rows } = await pool.query(
    `INSERT INTO product_reviews (product_id, variant_id, user_id, rating, comment)
     SELECT $1, pv.id, $2, $3, $4
     FROM product_variants pv
     WHERE pv.id = $5 AND pv.product_id = $1
     RETURNING id, product_id, variant_id, user_id, rating, comment, created_at, updated_at`,
    [productId, userId, rating, comment ?? null, variant_id]
  )
  return rows[0]
}

export async function findAll(productId) {
  const { rows } = await pool.query(
    `SELECT
       pr.id,
       pr.product_id,
       pr.variant_id,
       pv.name AS variant_name,
       pr.user_id,
       up.fullname AS user_name,
       pr.rating,
       pr.comment,
       pr.created_at,
       pr.updated_at
     FROM product_reviews pr
     LEFT JOIN product_variants pv ON pv.id = pr.variant_id
     LEFT JOIN user_profiles up ON up.user_id = pr.user_id
     WHERE pr.product_id = $1
     ORDER BY pr.created_at DESC`,
    [productId]
  )
  return rows
}
