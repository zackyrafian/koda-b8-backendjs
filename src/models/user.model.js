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
    `SELECT users.id, users.email, users.role, users.password, user_profiles.fullname 
     FROM users 
     LEFT JOIN user_profiles ON user_profiles.user_id = users.id 
     WHERE users.${args} = $1`,
    [value]
  );
  return data.rows[0];
}