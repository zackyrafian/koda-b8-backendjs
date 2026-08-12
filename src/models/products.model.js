import { pool } from "../config/postgres.js"

export async function remove(id) {
  const { rows } = await pool.query(
    `DELETE FROM products WHERE id = $1 RETURNING id, name`,
    [id]
  )
  return rows[0]
}

export async function create(body) {
  const { name, price, discount, stock, description, brand_id, category_id, variant } = body
  const variants = [...new Set(
    (typeof variant === "string" ? variant.split(",") : [])
      .map(value => value.trim())
      .filter(Boolean)
  )]
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    const { rows } = await client.query(
      `INSERT INTO products (name, price, discount, stock, description, brand_id, category_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, price, discount, stock, description, brand_id, category_id, created_at`,
      [name, price, discount ?? 0, stock, description, brand_id, category_id]
    )
    const product = rows[0]

    if (variants.length > 0) {
      const values = variants.map((_, index) => `($1, $${index + 2})`).join(", ")
      await client.query(
        `INSERT INTO product_variants (product_id, name) VALUES ${values}`,
        [product.id, ...variants]
      )
    }

    await client.query("COMMIT")
    return { ...product, variant: variants }
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export async function createImages(productId, urls) {
  if (!urls || urls.length === 0) return []
  const values = urls.map((url, i) => `($1, $${i + 2})`).join(", ")
  const { rows } = await pool.query(
    `INSERT INTO product_images (product_id, url) VALUES ${values} RETURNING id, url`,
    [productId, ...urls]
  )
  return rows
}

export async function findAll(search, page = null, limit = null) {
  if (page !== null || limit !== null) {
    page = page ?? 1
    limit = limit ?? 10
  }
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

  const paginate = page !== null && limit !== null
  let paginationClause = ''
  if (paginate) {
    const offset = (page - 1) * limit
    values.push(limit)
    const limitParam = `$${values.length}`
    values.push(offset)
    const offsetParam = `$${values.length}`
    paginationClause = `LIMIT ${limitParam} OFFSET ${offsetParam}`
  }

  const { rows } = await pool.query(
    `SELECT
      p.id,
      p.name,
      p.price,
      p.discount,
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
    ${whereClause}
    ORDER BY p.id
    ${paginationClause}`,
    values
  )

  const countValues = paginate ? values.slice(0, values.length - 2) : values
  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*) FROM products p
    JOIN brands b ON p.brand_id = b.id
    JOIN categories c ON p.category_id = c.id
    ${whereClause}`,
    countValues
  )
  const total = parseInt(countRows[0].count)

  if (!paginate) return { rows, total }
  const totalPages = Math.ceil(total / limit)
  return {
    rows,
    total,
    page,
    limit,
    totalPages,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  }
}

export async function findOne(args, value) {
  const { rows } = await pool.query(
    `SELECT
      p.id,
      p.name,
      p.price,
      p.discount,
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
