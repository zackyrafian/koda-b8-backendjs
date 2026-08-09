import { pool } from "../config/postgres.js"

export async function create(body) {
  const { name, price, discount, stock, description, brand_id, category_id } = body
  const { rows } = await pool.query(
    `INSERT INTO products (name, price, discount, stock, description, brand_id, category_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, price, discount, stock, description, brand_id, category_id, created_at`,
    [name, price, discount ?? 0, stock, description, brand_id, category_id]
  )
  return rows[0]
}

export async function findAll(search) {
  const conditions = []
  const values = []

  if (search?.name) {
    values.push(`%${search.name}%`)
    conditions.push(`p.name ILIKE $${values.length}`)
  }
  if (search?.brand) {
    values.push(`%${search.brand}%`)
    conditions.push(`b.name ILIKE $${values.length}`)
  }
  if (search?.category) {
    values.push(`%${search.category}%`)
    conditions.push(`c.name ILIKE $${values.length}`)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const { rows } = await pool.query(
    `SELECT
      p.id,
      p.name,
      p.price,
      p.discount,
      p.rating,
      p.stock,
      p.sold_out,
      p.description,
      p.created_at,
      p.updated_at,
      b.name AS brand,
      c.name AS category,
      COALESCE(
        (SELECT json_agg(pi.url ORDER BY pi.id)
         FROM product_images pi
         WHERE pi.product_id = p.id),
        '[]'
      ) AS images,
      COALESCE(
        (SELECT json_agg(pv.name ORDER BY pv.id)
         FROM product_variants pv
         WHERE pv.product_id = p.id),
        '[]'
      ) AS variant
    FROM products p
    JOIN brands b ON p.brand_id = b.id
    JOIN categories c ON p.category_id = c.id
    ${whereClause}`,
    values
  )
  return rows
}

export async function findOne(args, value) {
  const { rows } = await pool.query(
    `SELECT
      p.id,
      p.name,
      p.price,
      p.discount,
      p.rating,
      p.stock,
      p.sold_out,
      p.description,
      p.created_at,
      p.updated_at,
      b.name AS brand,
      c.name AS category,
      COALESCE(
        (SELECT json_agg(pi.url ORDER BY pi.id)
         FROM product_images pi
         WHERE pi.product_id = p.id),
        '[]'
      ) AS images,
      COALESCE(
        (SELECT json_agg(pv.name ORDER BY pv.id)
         FROM product_variants pv
         WHERE pv.product_id = p.id),
        '[]'
      ) AS variant
    FROM products p
    JOIN brands b ON p.brand_id = b.id
    JOIN categories c ON p.category_id = c.id
    WHERE p.${args} = $1`,
    [value]
  )
  return rows[0];
}
