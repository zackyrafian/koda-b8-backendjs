import { pool } from "../config/postgres.js"

export async function findAll() { 
  const {rows} = await pool.query(
    `SELECT id, name FROM brands` 
  )
  return rows
}

export async function findOne(args, value) {
  const { rows } = await pool.query(
    `SELECT id, name FROM brands WHERE ${args} = ${value}`
  )
  return rows[0]
}

export async function create(name) { 
  const { rows } = await pool.query(
    `INSERT INTO brands (name) VALUES ($1) RETURNING id, name`, [name]
  )
  return rows[0]
}

export async function remove(id) { 
  const { rows } = await pool.query(
    `DELETE FROM brands WHERE id = $1 RETURNING *`, [id]
  )
  return rows[0];
}