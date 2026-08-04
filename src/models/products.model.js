import { pool } from "../config/postgres.js"

export async function findAll(search) {
  const conditions = []
  const values = []

  if (search?.name) {
    values.push(`%${search.name}%`)
    conditions.push(`name ILIKE $${values.length}`)
  }
  if (search?.brand) {
    values.push(`%${search.brand}%`)
    conditions.push(`brand ILIKE $${values.length}`)
  }
  if (search?.category) {
    values.push(`%${search.category}%`)
    conditions.push(`category ILIKE $${values.length}`)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const { rows } = await pool.query(
    `SELECT * FROM products ${whereClause}`,
    values
  )
  return rows
}

export async function findOne(args, value) { 
  const { rows } = await pool.query(
    `SELECT * FROM products WHERE ${args} = $1`,
    [value]
  )
  return rows[0];
}