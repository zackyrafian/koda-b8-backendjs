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