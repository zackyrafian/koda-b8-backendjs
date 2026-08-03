import { pool } from "../config/postgres.js";


export async function create({ fullname, email, password }) { 
  const client = await pool.connect()
  try { 
    await client.query("BEGIN")
    const result = await client.query(
      `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id`, [email, password]
    )

    const userId = result.rows[0].id 
  
    await client.query(
      `INSERT INTO user_profiles(user_id, fullname) VALUES($1, $2)`, [userId, fullname]
    )
  
    await client.query("COMMIT")
    return { 
      id: userId, 
      fullname, 
      email, 
    }
  } catch (error) { 
    await client.query("ROLLBACK"); 
    throw error
  } finally {
    client.release();
  }
}

export async function findOne(args, value) { 
  const data = await pool.query(
    `SELECT id, email, password FROM users WHERE ${args} = $1`, [value] 
  )
  return data.rows[0]
}