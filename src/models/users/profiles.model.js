import { pool } from "../../config/postgres.js";

export async function findProfile(user_id) { 
  const { rows } = await pool.query(
    `SELECT u.id as id, u.email, up.fullname
    FROM users as u
    LEFT JOIN 
    user_profiles as up ON u.id = up.user_id WHERE u.id = $1`, [user_id] 
  )
  return rows[0];
}